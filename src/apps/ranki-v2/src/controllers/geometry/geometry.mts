import type { LitElement, ReactiveController, ReactiveElement } from "lit";
import type {
  GeometryParams,
  ComponentDims,
  Dims,
  R2CNewChildSizeEvent,
  InformedChildStyle,
  InformContext,
  SizingCb,
  TargetRec,
  TargetProps,
  TargetEventCb,
  TargetEventCbEvents,
  EmitIntent,
  TypedDims,
} from "./geometry.types.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { GeometryUtils } from "../../utils/geometry.utils.mjs";
import {
  assertNever,
  assertNotNull,
  assertNotUndefined,
} from "_error/assertions.mjs";
import { Animator } from "./geometry.animator.mjs";
import { AnimatorUtils } from "../../utils/animator.utils.mjs";
import { assertExists } from "../../../../../packages/dqm-utils/src/assertions.mjs";
import type { InformTargetParams } from "./geometry.animator.types.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import type { Size } from "_utils/sizing.utils.mjs";

type HostType = LitElement;

export class GeometryController<
  Instance extends LitElement,
> implements ReactiveController {
  private readonly host: Instance;
  private readonly registered = new WeakMap<R2C, TypedDims>();
  private readonly targets: TargetRec<Instance> | undefined;
  private readonly animator: Animator;
  private readonly on: TargetEventCb<Instance> | null = null;
  private sizing: Size | null = null;
  private requested = false;
  private currStyle: InformedChildStyle | null = null;

  constructor(host: Instance, params: GeometryParams<Instance>) {
    host.addController(this);
    this.host = host;
    this.targets = params.targets;
    this.on = params.on ? params.on : null;
    this.animator = new Animator(
      this.host,
      params.role,
      this.informTarget.bind(this),
    );
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

  public emit(intent: EmitIntent, dims?: Dims) {
    switch (intent) {
      case "update":
        assertNotUndefined(dims, {
          why: "Dims are required for emitting size",
        });
        GeometryUtils.emitSize(this.host, dims);
        break;
      case "leave":
        GeometryUtils.emitLeave(this.host);
        break;
      default:
        assertNever({
          why: "Unrecognized emit intent",
          details: { intent, dims },
        });
    }
  }

  private getTarget(id: string): TargetProps<Instance> {
    const s = this.targets && this.targets[id]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id },
    });
    return s;
  }

  private getSizing(): Size {
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
    let sizing = {} as Size;
    try {
      sizing = this.getSizing();
    } catch (e) {}

    const curr: InformedChildStyle = { ...sizing, ...informed };

    const actions = GeometryUtils.evaluateActions(curr, prev);

    this.currStyle = curr;
    const onEvent = this.on;
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-start` as TargetEventCbEvents);
      });
    }
    await this.animator.updateStyle(actions, this.currStyle, prev, context);
    if (onEvent) {
      actions.forEach((action) => {
        onEvent(this.host, `${action}-end` as TargetEventCbEvents);
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

  onEmit(id: string) {
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
            // !TODO remove these
            width: 0,
            height: 0,
          });
          break;
        case "disconnected":
          this.registered.delete(target);
          break;
        case "update":
          if (this.registered.has(target)) {
            this.registered.set(target, {
              intent: detail.intent,
              ...detail.rect,
            });
          } else {
            this.registered.set(target, { intent: "enter", ...detail.rect });
          }
          break;
      }
      switch (detail.intent) {
        case "leave":
        case "update":
          const sz = this.getSizingCallback(id);
          const ordered = this.orderTrackedNodes(id);
          this.sizing = sz(this.host)(ordered);
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                if (this.sizing)
                  if (this.getIsRoot(id)) {
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

  private getIsRoot(id: string): boolean {
    const target = this.getTarget(id);
    return !!target.isRoot;
  }

  private getSizingCallback(id: string): SizingCb {
    const target = this.getTarget(id);
    const s = target.sizing;
    assertNotUndefined(s, { why: "No sizing registered", details: { id } });
    return s;
  }

  private orderTrackedNodes(target: string) {
    const t = this.getTarget(target);
    const serial = t.selector(this.host);
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.registered.get(component);
      if (!dims) {
        // console.log("cannot find", component);
        continue;
        // FIX you may need to replace this with a boundingClientRect call
        // assertNever({ why: "The element should exist in weakmap" });
      }
      ordered.push({ component, dims });
    }
    return ordered;
  }

  private getDiff(id: string): ReconciliationDiff {
    const t = this.getTarget(id);
    // const t = this.changes[target];
    const diff = t.diff;
    if (!diff) {
      // console.log("diff detection not registered for target:", id);
      return ReconciliationUtils.noChanges();
    }
    return diff(this.host);
  }

  private async informTarget({
    id,
    curr,
    prev,
    inform,
  }: InformTargetParams): Promise<void> {
    // DECIDE this will result in running animation ignoring changes
    const diff = this.getDiff(id);
    await Promise.all(
      this.getTarget(id)
        .selector(this.host)
        .map((e, i, a) => {
          const context: InformContext = {
            index: i,
            length: a.length,
            stagger: diff.stagger.indices,
          };
          const informVals = AnimatorUtils.evalKeyframe(
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

  hostConnected(): void {}
}

export function geometry<Instance extends HostType>(
  params: GeometryParams<Instance>,
) {
  return (proto: HostType, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new GeometryController<Instance>(
        instance as Instance,
        params,
      );
    });
  };
}
