import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import { GeometryEval } from "_controllers/geometry/geometry-eval.mjs";
import {
  assertExists,
  assertNever,
  assertNotNull,
  assertNotUndefined,
} from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import type { LitElement, ReactiveController } from "lit";
import { Animator } from "../animator/animator.mjs";
import type { R2CNewChildSizeEvent } from "../events/geometry-events.types.mts";
import type {
  InformContext,
  InformedChildStyle,
  ComponentDims,
} from "../geometry.types.mjs";
import type { EmitIntent } from "../geometry-intent.types.mts";
import type { WidthHeight } from "../geometry-style.types.mts";
import type {
  GeometryControllerConstructorParams,
  GeometrySetLayoutCb,
  GeometryEventCb,
  GeometryEventName,
  GeometrySetProps,
  GeometrySetRecord,
} from "./geometry-decorator.constructor.types.mts";
import type { LayoutSizing } from "../layout/layout-utils.types.mts";
import { LayoutParser } from "_controllers/geometry/parser/layout-parser.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import type { InformTargetParams } from "../animator/animator.types.mjs";
import { GeometryEvents } from "../events/geometry-events.mjs";
import { type EmitModes } from "../events/geometry-events.types.mjs";
import type {
  GeometrySetName,
  OnEmitParams,
} from "./geometry-controller.types.mts";

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
  private currStyle: InformedChildStyle | null = null;
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
      informTarget: this.informTarget.bind(this),
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

  private getSizing(): LayoutSizing {
    assertNotNull(this.sizing, {
      why: "getSizing called when no geometry was registered",
    });
    return this.sizing;
  }

  public async informStyle(
    informed: InformedChildStyle,
    context: InformContext,
  ): Promise<void> {
    const prev = this.currStyle;
    let sizing = {} as LayoutSizing;
    try {
      sizing = this.getSizing();
    } catch (e) {}

    const curr: InformedChildStyle = { ...sizing, ...informed };

    const actions = GeometryEval.evaluateActions(curr, prev);

    this.currStyle = curr;
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as GeometryEventName);
      });
    }
    await this.animator.updateStyle(actions, this.currStyle, prev, context);
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-end` as GeometryEventName);
      });
    }
  }

  private informAsRoot(geo: InformedChildStyle) {
    this.informStyle(geo, {
      index: 0,
      length: 1,
      stagger: [0],
    });
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
          this.registered.set(
            target,
            // @ts-expect-error
            {
              intent: detail.intent,
              // !TODO remove these
              width: 0,
              height: 0,
            },
          );
          break;
        case "disconnected":
          this.registered.delete(target);
          break;
        case "update":
          if (this.registered.has(target)) {
            this.registered.set(
              target,
              // @ts-expect-error
              {
                intent: detail.intent,
                ...detail.rect,
              },
            );
          } else {
            this.registered.set(
              target,
              // @ts-expect-error
              { intent: "enter", ...detail.rect },
            );
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
          console.log(this.registered.get(target));
        // console.log("mode", e);
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
                    const inform = {
                      intent: this.sizing.intents[0],
                      ...this.sizing,
                    };
                    this.informAsRoot(inform);
                  } else {
                    this.emit("update", this.sizing);
                  }
              }, PROPAGATE_DELAY);
            });
          }
      }
    };
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

  private async informTarget({
    set,
    curr,
    prev,
    inform,
  }: InformTargetParams): Promise<void> {
    // DECIDE this will result in running animation ignoring changes
    const diff = this.getDiff(set);
    await Promise.all(
      this.getSet(set)
        .selector(this.host)
        .map((e, i, a) => {
          const context: InformContext = {
            index: i,
            length: a.length,
            stagger: diff.stagger.indices,
          };
          const informVals = LayoutParser.evalKeyframe(
            curr,
            prev,
            context,
            inform,
          );
          const informed = {
            ...informVals,
            intent: curr.intents[context.index],
          };
          return e.informStyle(informed, context);
        }),
    );
  }

  hostConnected(): void {
    if (this.events.hover) {
      this.host.addEventListener("pointerenter", this.onPointerEnter);
      this.host.addEventListener("pointerleave", this.onPointerLeave);
    }
  }

  hostDisconnected(): void {
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
