import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement, ReactiveController } from "lit";

import type { InformSetProps } from "./animator/types/animator.types.mjs";
import type { LayoutSizing } from "./sets/children/layout/layout-utils.types.mjs";
import type { GeometryControllerConstructorParams } from "./types/geometry-controller.constructor.types.mjs";
import type { GeometryControllerStaticConfig } from "./types/geometry-controller.static.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "./types/geometry-controller.types.mjs";

import { O11y } from "../o11y/o11y.mjs";
import { Animator } from "./animator/animator.mjs";
import { GeometryEvents } from "./events/geometry-events.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import { GeometrySetsUtils } from "./sets/geometry-sets-utils.mjs";
import { GeometrySets } from "./sets/sets.mjs";
import { TimingUtils } from "./utils/timing.utils.mjs";
import type { OnEmitCallbackParams } from "./events/types/geometry-events.types.mjs";

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
  private inSession: boolean = false;
  private readonly isRoot: boolean;
  private readonly o11y: O11y<this>;

  private prev: CurrentAppliedStyle | null = null;
  private readonly sets: GeometrySets<Instance>;
  private sizing: LayoutSizing | null = null;

  constructor(
    host: Instance,
    params: GeometryControllerConstructorParams<Instance>,
  ) {
    this.isRoot = params.isRoot || false;
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
    });
    this.o11y = new O11y(this, {
      // logger: {
      //   attributes: () => ({
      //     host: this.host,
      //   }),
      // },
      meter: {
        counters: {
          informStyle: {
            unit: "call",
          },
          onEmit: {
            unit: "call",
          },
        },
      },
      tracer: {
        nameFormat: ({ name }) => [this.host.tagName, name].join(":"),
      },
    });
    this.bindHostMethods();
  }

  static configure(conf: GeometryControllerStaticConfig) {
    if (conf.observability) O11y.configure(conf.observability);
  }

  hostConnected(): void {
    this.events.emit({ type: "lifecycle", lifecycle: "connected" });
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
    this.events.emit({ type: "lifecycle", lifecycle: "disconnected" });
  }

  watcher() {
    return this.events.onEmit(async (event) => {
      switch (event.detail.type) {
        case "lifecycle": {
          switch (event.detail.lifecycle) {
            case "connected":
              return this.sets.addWatcher(event.target);
            case "disconnected":
              return this.sets.removeWatcher(event.target);
          }
        }
      }
    });
  }

  child() {
    return this.events.onEmit(async (event) => {
      return this.o11y.trace.span("onEmit", async () => {
        switch (event.detail.type) {
          case "lifecycle":
            return this.lifecycle(event);
          default:
        }
      });
    });
  }

  private async lifecycle(event: OnEmitCallbackParams) {
    if (event.detail.type !== "lifecycle") return;
    switch (event.detail.lifecycle) {
      case "connected":
        return this.lifecycleConnected(event);
      case "disconnected":
        return this.lifecycleDisconnected(event);
      case "leave":
      case "update":
        return await this.lifecycleUpdate(event);
    }
  }

  private lifecycleConnected(event: OnEmitCallbackParams) {
    this.o11y.devtools.log("emit.lifecycle.connected", {
      curr: this.curr,
      event,
      host: this.host,
      prev: this.prev,
      sizing: this.sizing,
      tag: this.host.tagName,
    });
    this.sets.addChild(event.target);
  }

  private lifecycleDisconnected(event: OnEmitCallbackParams) {
    this.o11y.devtools.log("emit.lifecycle.connected", {
      curr: this.curr,
      event,
      host: this.host,
      prev: this.prev,
      sizing: this.sizing,
      tag: this.host.tagName,
    });
    this.sets.removeChild(event.target);
  }

  private lifecycleUpdate(event: OnEmitCallbackParams) {
    return this.o11y.trace.span(
      "onEmit.lifecycle.update",
      async ({ session, span, withLink }) => {
        this.sizing = this.sets.onEmit(event);
        if (!this.isRoot) {
          span.addEvent("controller.propagate.up");
          this.o11y.devtools.log("emit.lifecycle.update.not-root", {
            curr: this.curr,
            event,
            host: this.host,
            prev: this.prev,
            sizing: this.sizing,
            tag: this.host.tagName,
          });
          this.events.emit({
            lifecycle: "update",
            style: this.sizing.container,
            type: "lifecycle",
          });
          return;
        }
        if (this.inSession) {
          session.join(span);
          return;
        }
        this.inSession = true;
        session.start();
        this.o11y.devtools.log("session.start", {
          event,
          host: this.host,
          sizing: this.sizing,
          tag: this.host.tagName,
        });
        await this.wait.raf(3);
        this.inSession = false;
        const inform = GeometrySetsUtils.prepareRootStyle(this.sizing);
        session.end();
        this.o11y.devtools.log("session.end", {
          event,
          inform,
          sizing: this.sizing,
        });
        span.addEvent("controller.propagate.down");
        await withLink(() => this.informStyle(inform));
        span.addEvent("controller.animation.end");
        this.o11y.devtools.log("root.animation.end", {
          event,
          inform,
          sizing: this.sizing,
        });
      },
    );
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindHostMethods() {
    (this.host as unknown as R2C).informStyle = this.informStyle.bind(this);
  }

  private async informSet(props: InformSetProps): Promise<void> {
    return this.o11y.trace.span("informSet", () => {
      this.o11y.devtools.log("informSet", { props, sizing: this.sizing });
      return this.sets.inform(props, this.sizing);
    });
  }

  private async informStyle(informed: InformedChildStyle): Promise<void> {
    if (this.host.tagName.includes("NOTIFICATION")) {
      console.log("ddd", informed);
    }
    return this.o11y.trace.span("informStyle", async ({ span }) => {
      this.o11y.meter.count("informStyle");
      this.prev = this.curr;
      const curr = GeometryMerger.createCurrStyle(
        informed,
        this.sizing,
        this.prev,
      );
      this.curr = curr;

      span.addEvent("style.ready");

      this.o11y.devtools.log("informStyle", {
        curr: this.curr,
        host: this.host,
        informed,
        prev: this.prev,
        sizing: this.sizing,
        tag: this.host.tagName,
      });

      this.events.onActionsStart(this.curr.actions);
      await this.animator.update(curr, this.prev);
      this.events.onActionsEnd(this.curr.actions);
    });
  }
}
