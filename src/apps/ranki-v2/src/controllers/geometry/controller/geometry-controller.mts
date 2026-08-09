import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement, ReactiveController } from "lit";

import { DebugUtils } from "_/debug/debug-utils.mjs";
import { assertExists, assertNever } from "_error/assertions.mjs";

import type { InformSetProps } from "./animator/animator.types.mjs";
import type { R2CNewChildSizeEvent } from "./events/geometry-events.types.mjs";
import type { LayoutSizing } from "./sets/children/layout/layout-utils.types.mjs";
import type { GeometryControllerConstructorParams } from "./types/geometry-controller.constructor.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
} from "./types/geometry-controller.types.mjs";

import { Animator } from "./animator/animator.mjs";
import { GeometryEvents } from "./events/geometry-events.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import { GeometrySets } from "./sets/sets.mjs";

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  public readonly events: GeometryEvents<Instance>;
  private readonly animator: Animator;
  private curr: CurrentAppliedStyle | null = null;
  private readonly host: Instance;
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
    this.bindInformStyle();
  }

  hostConnected(): void {
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
  }

  onEmit() {
    return async (e: CustomEvent<R2CNewChildSizeEvent>) => {
      e.stopPropagation();
      const target = e.composedPath()[0] as null | R2C;
      assertExists(target, { why: "No valid target given" });

      const update = await this.sets.onEmit(target, e.detail);
      if (!update) return;
      DebugUtils.geometryControllerOnEmit({ host: this.host, update });

      this.sizing = update.sizing;
      switch (update.type) {
        case "root":
          this.informStyle(update.inform);
          break;
        case "update":
          this.events.emit({
            type: "intent",
            intent: "update",
            style: update.sizing.container,
          });
          break;
        default:
          assertNever({
            details: { update },
            why: "Unrecognized children update type",
          });
      }
    };
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindInformStyle() {
    (this.host as unknown as R2C).informStyle = this.informStyle.bind(this);
  }

  private async informSet(props: InformSetProps): Promise<void> {
    return this.sets.inform(props, this.sizing);
  }

  private async informStyle(informed: InformedChildStyle): Promise<void> {
    this.prev = this.curr;
    this.curr = GeometryMerger.createCurrStyle(
      informed,
      this.sizing,
      this.prev,
    );

    DebugUtils.informStyle({
      curr: this.curr,
      host: this.host,
      prev: this.prev,
      sizing: this.sizing,
      informed: informed,
    });

    this.events.onActionsStart(this.curr.actions);
    await this.animator.update(this.curr, this.prev);
    this.events.onActionsEnd(this.curr.actions);
  }
}
