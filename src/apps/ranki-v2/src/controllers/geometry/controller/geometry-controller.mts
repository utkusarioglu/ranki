import { DebugUtils } from "_/debug/debug-utils.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import type { LitElement, ReactiveController } from "lit";
import type { LayoutSizing } from "../layout/layout-utils.types.mjs";
import { Animator } from "./animator/animator.mjs";
import { GeometryEvents } from "./events/geometry-events.mjs";
import type { R2CNewChildSizeEvent } from "./events/geometry-events.types.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import type { GeometryControllerConstructorParams } from "./types/geometry-controller.constructor.types.mjs";
import type {
  CurrentAppliedStyle,
  InformedChildStyle,
  OnEmitParams,
} from "./types/geometry-controller.types.mjs";
import { GeometryChildren } from "./children/children.mjs";
import { assertNever, assertNotUndefined } from "_error/assertions.mjs";
import type { InformSetProps } from "./animator/animator.types.mjs";

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  private readonly host: Instance;
  private readonly animator: Animator;
  public readonly events: GeometryEvents<Instance>;
  private sizing: LayoutSizing | null = null;
  private curr: CurrentAppliedStyle | null = null;
  private prev: CurrentAppliedStyle | null = null;
  private readonly children: GeometryChildren<Instance> | undefined;

  constructor(
    host: Instance,
    params: GeometryControllerConstructorParams<Instance>,
  ) {
    host.addController(this);
    this.host = host;
    // this.targets = params.sets;
    this.animator = new Animator(this.host, params.role, {
      informSet: this.informSet.bind(this),
    });
    this.events = new GeometryEvents({
      host: this.host,
      events: params.events,
      on: params.on,
    });
    if (params.sets)
      this.children = new GeometryChildren(this.host, params.sets);
    this.bindInformStyle();
  }

  private async informSet(props: InformSetProps): Promise<void> {
    assertNotUndefined(this.children, {
      why: "Informing children when none has been defined",
    });
    return this.children.informSet(props, this.sizing);
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindInformStyle() {
    // @ts-expect-error
    this.host.informStyle = this.informStyle.bind(this);
  }

  onEmit({ set }: OnEmitParams) {
    return async (e: CustomEvent<R2CNewChildSizeEvent>) => {
      e.stopPropagation();
      assertNotUndefined(this.children, {
        why: "Received emit when no children has been defined",
      });
      const detail = e.detail;
      const target = e.composedPath()[0] as R2C;
      if (!target)
        throw new RankiAppError({
          code: "NO_TARGET",
          why: "No valid target given",
          cause: {},
        });
      this.children.registerEmit(detail, target);
      const update = await this.children.updateSizing(detail, set);
      if (!update) return;
      this.sizing = update.sizing;
      switch (update.type) {
        case "root":
          this.informStyle(update.inform);
          break;
        case "update":
          this.events.emit("update", update.sizing.container);
          break;
        default:
          assertNever({
            why: "Unrecognized children update type",
            details: { update },
          });
      }
    };
  }

  public async informStyle(informed: InformedChildStyle): Promise<void> {
    this.prev = this.curr;
    this.curr = GeometryMerger.createCurrStyle(
      informed,
      this.sizing,
      this.prev,
    );

    DebugUtils.informStyle({
      host: this.host,
      curr: this.curr,
      prev: this.prev,
      sizing: this.sizing,
    });

    this.events.onActionsStart(this.curr.actions);
    await this.animator.update(this.curr, this.prev);
    this.events.onActionsEnd(this.curr.actions);
  }

  hostConnected(): void {
    this.events.registerListeners();
  }

  hostDisconnected(): void {
    this.events.deregisterListeners();
  }
}
