import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import {
  assertExists,
  assertNever,
  assertNotUndefined,
} from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import type { LitElement, ReactiveController } from "lit";
import { Animator } from "./animator/animator.mjs";
import type { InformSetProps } from "./animator/animator.types.mjs";
import { GeometryMerger } from "./merger/geometry-merger.mjs";
import { GeometryEvents } from "../events/geometry-events.mjs";
import { type EmitModes } from "../events/geometry-events.types.mjs";
import type { R2CNewChildSizeEvent } from "../events/geometry-events.types.mts";
import type { EmitIntent, LocalAction } from "../geometry-intent.types.mts";
import type { WidthHeight } from "../geometry-style.types.mts";
import type { LayoutSizing } from "../layout/layout-utils.types.mts";
import type {
  ComponentDims,
  CurrentAppliedStyle,
  GeometrySetName,
  InformContext,
  InformedChildStyle,
  OnEmitParams,
} from "./types/geometry-controller.types.mts";
import type {
  GeometryControllerConstructorParams,
  GeometryEventCb,
  GeometryEventName,
  GeometrySetLayoutCb,
  GeometrySetProps,
  GeometrySetRecord,
} from "./types/geometry-controller.constructor.types.mts";
import { DebugUtils } from "_/debug/debug-utils.mjs";

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  private readonly host: Instance;
  private readonly registered = new WeakMap<R2C, ComponentDims>();
  private readonly targets: GeometrySetRecord<Instance> | undefined;
  private readonly animator: Animator;
  private readonly on: GeometryEventCb<Instance> | null = null;
  private sizing: LayoutSizing | null = null;
  private requested = false;
  private curr: CurrentAppliedStyle | null = null;
  private prev: CurrentAppliedStyle | null = null;
  private events: { hover: boolean };

  constructor(
    host: Instance,
    params: GeometryControllerConstructorParams<Instance>,
  ) {
    host.addController(this);
    this.host = host;
    this.targets = params.sets;
    this.on = params.on ? params.on : null;
    this.animator = new Animator(this.host, params.role, {
      informSet: this.informSet.bind(this),
    });
    this.events = { hover: false, ...params.events };
    this.bindInformStyle();
  }

  /**
   * This is the method parent uses to tell its child what style it's
   * supposed to animate towards
   */
  private bindInformStyle() {
    // @ts-expect-error
    this.host.informStyle = this.informStyle.bind(this);
  }

  public emit(intent: EmitIntent, dims?: WidthHeight | EmitModes) {
    switch (intent) {
      case "update":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEvents.emitUpdate(this.host, dims);
        break;
      case "leave":
        GeometryEvents.emitLeave(this.host);
        break;
      case "mode":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryEvents.emitMode(this.host, dims as unknown as EmitModes);
        break;
      default:
        assertNever({
          why: "Unrecognized emit intent",
          details: { intent, dims },
        });
    }
  }

  private getSet(set: GeometrySetName): GeometrySetProps<Instance> {
    const s = this.targets && this.targets[set]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id: set },
    });
    return s;
  }

  private getSizing(): LayoutSizing | null {
    return this.sizing;
  }

  private informAsRoot(geo: LayoutSizing) {
    const inform: InformedChildStyle = {
      context: {
        index: 0,
        length: 1,
        stagger: 0,
      },
      containerExposed: {
        // intent: geo.set[0].intent,
        style: geo.container,
      },
      selfOverrides: {
        style: {},
      },
      // item: geo.set[0],
    };
    this.informStyle(inform);
  }

  private getIsRoot(setName: GeometrySetName): boolean {
    const set = this.getSet(setName);
    return !!set.isRoot;
  }

  private getSizingCallback(setName: GeometrySetName): GeometrySetLayoutCb {
    const set = this.getSet(setName);
    const layout = set.layout;
    assertNotUndefined(layout, {
      why: "No sizing registered",
      details: { setName },
    });
    return layout;
  }

  private orderTrackedNodes(setName: GeometrySetName) {
    const set = this.getSet(setName);
    const serial = set.selector(this.host);
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push(dims);
    }
    return ordered;
  }

  private getDiff(setName: GeometrySetName): ReconciliationDiff {
    const set = this.getSet(setName);
    // const t = this.changes[target];
    const diff = set.diff;
    if (!diff) {
      // console.log("diff detection not registered for target:", id);
      return ReconciliationUtils.noChanges();
    }
    return diff(this.host);
  }

  onEmit({ set }: OnEmitParams) {
    return (e: CustomEvent<R2CNewChildSizeEvent>) => {
      e.stopPropagation();
      const detail = e.detail;
      const target = e.composedPath()[0] as R2C;
      if (!target)
        throw new RankiAppError({
          code: "NO_TARGET",
          why: "No valid target given",
          cause: {},
        });
      switch (detail.intent) {
        case "leave":
          this.registered.set(target, {
            intent: detail.intent,
            style: {
              width: 0,
              height: 0,
            },
          });
          break;
        case "disconnected":
          this.registered.delete(target);
          break;
        case "update":
          if (this.registered.has(target)) {
            this.registered.set(target, {
              intent: detail.intent,
              style: detail.style,
              // ...detail.rect,
            });
          } else {
            this.registered.set(target, {
              intent: "enter",
              style: detail.style,
            });
          }
          break;
        case "mode":
          this.registered.set(
            target,
            // @ts-expect-error
            {
              ...this.registered.get(target),
              intent: "enter",
              mode: detail.mode,
            },
          );
      }
      switch (detail.intent) {
        case "leave":
        case "update":
          const sz = this.getSizingCallback(set);
          const ordered = this.orderTrackedNodes(set);
          this.sizing = sz(this.host)(ordered);
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                if (this.sizing)
                  if (this.getIsRoot(set)) {
                    this.informAsRoot(this.sizing);
                  } else {
                    this.emit("update", this.sizing.container);
                  }
              }, PROPAGATE_DELAY);
            });
          }
      }
    };
  }

  private async informSet(props: InformSetProps): Promise<void> {
    const diff = this.getDiff(props.setName);
    const sizing = this.getSizing();
    await Promise.all(
      this.getSet(props.setName)
        .selector(this.host)
        .map((e, i, a) => {
          const context: InformContext = {
            index: i,
            length: a.length,
            stagger: diff.stagger.indices[i],
          };
          const informed = GeometryMerger.createSetItemInformer({
            context,
            props,
            sizing,
          });

          DebugUtils.informSet({ e, host: this.host, informed, props });
          return e.informStyle(informed);
        }),
    );
  }

  public async informStyle(informed: InformedChildStyle): Promise<void> {
    const sizing = this.getSizing();
    this.prev = this.curr;
    this.curr = GeometryMerger.createCurrStyle(informed, sizing, this.prev);

    DebugUtils.informStyle({
      host: this.host,
      curr: this.curr,
      prev: this.prev,
      sizing,
    });

    this.onActionsStart(this.curr.actions);
    await this.animator.update(this.curr, this.prev);
    this.onActionsEnd(this.curr.actions);
  }

  private onActionsStart(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as GeometryEventName);
      });
    }
  }

  private onActionsEnd(actions: LocalAction[]) {
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-end` as GeometryEventName);
      });
    }
  }

  hostConnected(): void {
    this.registerListeners();
  }

  hostDisconnected(): void {
    this.deregisterListeners();
  }

  private registerListeners() {
    if (this.events.hover) {
      this.host.addEventListener("pointerenter", this.onPointerEnter);
      this.host.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  private deregisterListeners() {
    if (this.events.hover) {
      this.host.removeEventListener("pointerenter", this.onPointerEnter);
      this.host.removeEventListener("pointerleave", this.onPointerLeave);
    }
  }

  private onPointerEnter = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit("mode", "hover-start");
  };

  private onPointerLeave = (e: PointerEvent) => {
    e.stopPropagation();
    this.emit("mode", "hover-end");
  };
}
