import type { LitElement, ReactiveController, ReactiveElement } from "lit";
import type {
  GeometryParams,
  ComponentDims,
  Dims,
  R2CNewChildSizeEvent,
  R2Sizing,
  InformStyle,
  InformContext,
  UpdateStyle,
  SizingCb,
  TargetRec,
  TargetProps,
  TargetEventCb,
} from "./geometry.types.mts";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { GeometryUtils } from "./geometry.utils.mts";
import { assertNotNull, assertNotUndefined } from "_error/assertions.mjs";
import { Animator } from "./geometry.animator.mts";
import { AnimationUtils } from "./animator.utils.mts";
import { assertExists } from "../../../../packages/dqm-utils/src/assertions.mts";
import type { InformTargetParams } from "./geometry.animator.types.mts";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.mjs";

type HostType = LitElement;

export class GeometryController implements ReactiveController {
  private readonly host: HostType;
  private readonly registered = new WeakMap<R2C, Dims>();
  private readonly targets: TargetRec | undefined;
  private readonly animator: Animator;
  private readonly on: TargetEventCb | null = null;
  private sizing: R2Sizing | null = null;
  private requested = false;
  private currStyle: UpdateStyle | null = null;

  constructor(host: HostType, params: GeometryParams) {
    host.addController(this);
    this.host = host;
    this.targets = params.targets;
    this.on = params.on ? params.on : null;
    this.animator = new Animator(
      this.host,
      params.role,
      this.informTarget.bind(this),
    );
  }

  public emitSize(dims: Dims) {
    GeometryUtils.emitSize(this.host, dims);
  }

  private getTarget(id: string): TargetProps {
    const s = this.targets && this.targets[id]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id },
    });
    return s;
  }

  private getSizing(): R2Sizing {
    assertNotNull(this.sizing, {
      why: "getSizing called when no geometry was registered",
    });
    return this.sizing;
  }

  public async informStyle(
    informed: InformStyle,
    context: InformContext,
  ): Promise<void> {
    const prev = this.currStyle;
    let sizing = {} as R2Sizing;
    try {
      sizing = this.getSizing();
    } catch (e) {}

    // const sizeMerged: R2Sizing = { ...informed, ...sizing };
    const sizeMerged: R2Sizing = { ...sizing, ...informed };
    console.log({ informed, sizing, sizeMerged });
    const action = GeometryUtils.evaluateAction(sizeMerged, prev);
    const curr: UpdateStyle = { ...sizeMerged, action };

    this.currStyle = curr;
    await this.animator.updateStyle(this.currStyle, prev, context);
    this.on && this.on(this.host, action);
  }

  private informAsRoot(geo: R2Sizing) {
    this.informStyle(geo, {
      index: 0,
      length: 1,
      stagger: [0],
    });
  }

  onChildSize(id: string) {
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
      switch (detail.type) {
        case "connected":
          this.registered.set(target, { width: 0, height: 0 });
          break;
        case "disconnected":
          this.registered.delete(target);
          break;
        case "update":
          this.registered.set(target, detail.rect);
          break;
      }
      switch (detail.type) {
        case "disconnected":
        case "update":
          const sz = this.getSizingCallback(id);
          this.sizing = sz(this.orderTrackedNodes(id));
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                if (this.sizing)
                  if (this.getIsRoot(id)) {
                    this.informAsRoot(this.sizing);
                  } else {
                    this.emitSize(this.sizing);
                    // GeometryUtils.emitSize(
                    //   this.host as LitElement,
                    //   this.sizing,
                    // );
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
      console.log("diff detection not registered for target:", id);
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
          const informVals = AnimationUtils.evalKeyframe(
            curr,
            prev,
            context,
            inform,
          );
          return e.informStyle(informVals, context);
        }),
    );
  }

  hostConnected(): void {}
}

export function geometry(params: GeometryParams) {
  return (proto: HostType, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new GeometryController(
        instance as HostType,
        params,
      );
    });
  };
}
