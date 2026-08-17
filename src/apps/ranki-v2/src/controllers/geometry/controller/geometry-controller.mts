import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement, ReactiveController } from "lit";

import { assertNever } from "_error/assertions.mjs";

import type { InformSetProps } from "./animator/types/animator.types.mjs";
import type { LayoutSizing } from "./sets/children/layout/layout-utils.types.mjs";
import type { GeometryControllerConstructorParams } from "./types/geometry-controller.constructor.types.mjs";
import type { GeometryControllerStaticConfig } from "./types/geometry-controller.static.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "./types/geometry-controller.types.mjs";

import { Animator } from "./animator/animator.mjs";
import { GeometryEvents } from "./events/geometry-events.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import { O11y } from "./o11y/o11y.mjs";
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
  private readonly o11y: O11y<this>;
  private prev: CurrentAppliedStyle | null = null;
  private readonly sets: GeometrySets<Instance>;

  private sizing: LayoutSizing | null = null;

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
    this.o11y = new O11y(this, {
      logger: {
        host: this.host,
      },
      tracer: {
        nameFormat: ({ name }) => [this.host.tagName, name].join(":"),
      },
    });
    this.bindInformStyle();
  }

  static configure(conf: GeometryControllerStaticConfig) {
    if (conf.observability) O11y.configure(conf.observability);
  }

  hostConnected(): void {
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
  }

  onEmit() {
    return this.events.onEmit(async (target, detail) => {
      return this.o11y.trace.span("onEmit", async ({ span, withCtx }) => {
        const update = await this.sets.onEmit(target, detail);
        span.setAttribute("geometry.session.id", update.session.id);
        span.setAttribute("geometry.session.start", update.session.start);
        span.setAttribute("geometry.session.index", update.session.index);

        await withCtx(async () => {
          if (update.type === "terminate") {
            span.addEvent("session.joined");
            return;
          }
          span.addEvent("session.completed");
          this.o11y.log.debug("onEmit.callback.update", { update });

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
        });
      });
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
    this.o11y.log.debug("informSet", { props });
    return this.o11y.trace.span("informSet", () => {
      return this.sets.inform(props, this.sizing);
    });
  }

  private async informStyle(informed: InformedChildStyle): Promise<void> {
    return this.o11y.trace.span("informStyle", async ({ span }) => {
      this.prev = this.curr;
      const curr = GeometryMerger.createCurrStyle(informed, this.sizing);
      this.curr = curr;

      span.addEvent("style.ready");

      this.o11y.log.info("informStyle", {
        curr: this.curr,
        informed,
        prev: this.prev,
        sizing: this.sizing,
      });

      this.events.onActionsStart(this.curr.actions);
      await this.animator.update(curr, this.prev);
      this.events.onActionsEnd(this.curr.actions);
    });
  }
}
