import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement, ReactiveController } from "lit";

import { assertNever } from "_error/assertions.mjs";
import { trace, type Tracer } from "@opentelemetry/api";

import type { InformSetProps } from "./animator/types/animator.types.mjs";
import type { LayoutSizing } from "./sets/children/layout/layout-utils.types.mjs";
import type { GeometryControllerConstructorParams } from "./types/geometry-controller.constructor.types.mjs";
import type { GeometryControllerStaticConfig } from "./types/geometry-controller.static.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "./types/geometry-controller.types.mjs";

import { Animator } from "./animator/animator.mjs";
import { Debug } from "./debug/debug.mjs";
import { GeometryEvents } from "./events/geometry-events.mjs";
import { Logger } from "./logger/logger.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import { GeometrySets } from "./sets/sets.mjs";
import { TimingUtils } from "./utils/timing.utils.mjs";

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  public readonly events: GeometryEvents<Instance>;
  public readonly wait = {
    delay: TimingUtils.delay,
    layout: () => TimingUtils.raf(2),
    raf: TimingUtils.raf,
  };
  private readonly animator: Animator<Instance>;
  private curr: CurrentAppliedStyle | null = null;
  private readonly host: Instance;
  private readonly logger: Logger;
  private prev: CurrentAppliedStyle | null = null;
  private readonly sets: GeometrySets<Instance>;
  private sizing: LayoutSizing | null = null;

  private readonly tracer: Tracer;

  constructor(
    host: Instance,
    params: GeometryControllerConstructorParams<Instance>,
  ) {
    host.addController(this);
    this.host = host;
    this.animator = new Animator(this.host, params.role, {
      getCollection: params.collection,
      informSet: this.informSet.bind(this),
    });
    this.events = new GeometryEvents({
      events: params.events,
      host: this.host,
      on: params.on,
    });
    this.sets = new GeometrySets(this.host, {
      children: params.children,
      watchers: params.watchers,
    });
    this.tracer = trace.getTracer(this.constructor.name);
    this.logger = new Logger({
      class: "GeometryController",
      host: this.host,
    });
    this.bindInformStyle();
  }

  static configure(conf: GeometryControllerStaticConfig) {
    if (conf.log?.drivers) {
      conf.log.drivers.forEach((dr) => {
        Logger.addDriver(dr);
      });
    }
    if (conf.debug?.sequencer?.stutter) {
      Debug.DEBUG_DELAY = conf.debug.sequencer.stutter;
    }
  }

  hostConnected(): void {
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
  }

  onEmit() {
    return this.events.onEmit(async (target, detail) => {
      return this.tracer.startActiveSpan(
        `${this.host.tagName}:onEmit`,
        async (span) => {
          try {
            const update = await this.sets.onEmit(target, detail);
            if (!update) {
              span.addEvent("session.joined");
              return;
            }
            span.addEvent("session.completed");
            this.logger.debug("onEmit.callback.update", { update });

            this.sizing = update.sizing;
            switch (update.type) {
              case "root":
                span.addEvent("controller.propagate.down");
                await this.informStyle(update.inform);
                break;
              case "update":
                span.addEvent("controller.propagate.up");
                this.events.emit({
                  lifecycle: "update",
                  style: update.sizing.container,
                  type: "lifecycle",
                });
                break;
              default:
                assertNever({
                  details: { update },
                  why: "Unrecognized children update type",
                });
            }
          } finally {
            span.end();
          }
        },
      );
    });
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindInformStyle() {
    (this.host as unknown as R2C).informStyle = this.informStyle.bind(this);
  }

  private async informSet(props: InformSetProps): Promise<void> {
    this.logger.debug("informSet", { props });
    return this.tracer.startActiveSpan(
      `${this.host.tagName}:informSet`,
      async (span) => {
        try {
          return this.sets.inform(props, this.sizing);
        } finally {
          span.end();
        }
      },
    );
  }

  private async informStyle(informed: InformedChildStyle): Promise<void> {
    return this.tracer.startActiveSpan(
      `${this.host.tagName}:informStyle`,
      async (span) => {
        try {
          this.prev = this.curr;
          const curr = GeometryMerger.createCurrStyle(informed, this.sizing);
          this.curr = curr;

          span.addEvent("style.ready");

          this.logger.info("informStyle", {
            curr: this.curr,
            informed,
            prev: this.prev,
            sizing: this.sizing,
          });

          this.events.onActionsStart(this.curr.actions);
          await this.animator.update(curr, this.prev);
          this.events.onActionsEnd(this.curr.actions);
        } finally {
          span.end();
        }
      },
    );
  }
}
