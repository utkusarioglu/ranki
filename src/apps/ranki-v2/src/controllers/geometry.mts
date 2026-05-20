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
} from "./geometry.types.mts";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { GeometryUtils } from "./geometry.utils.mts";
import { assertNotNull, assertNotUndefined } from "_error/assertions.mjs";
import { Animator, evalKeyframe } from "./geometry.animator.mts";
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
  private readonly targets: TargetRec;
  private readonly animator: Animator;
  private geometry: R2Sizing | null = null;
  private requested = false;
  private currStyle: UpdateStyle | null = null;

  constructor(host: HostType, params: GeometryParams) {
    host.addController(this);
    this.host = host;
    this.targets = params.targets;
    this.animator = new Animator(
      this.host,
      params.role,
      this.informTarget.bind(this),
    );
  }

  private getTarget(id: string): TargetProps {
    const s = this.targets[id]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id },
    });
    return s;
  }

  private getSizing(): R2Sizing {
    assertNotNull(this.geometry, {
      why: "getGeometry called when no geometry was registered",
    });
    return this.geometry;
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

    const evaluations = {
      main: GeometryUtils.evaluateChange(sizing, prev, "width"),
      cross: GeometryUtils.evaluateChange(sizing, prev, "height"),
    };
    const curr = { ...informed, ...sizing, ...evaluations };

    this.currStyle = curr;
    return this.animator.updateStyle(this.currStyle, prev, context);
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
          this.geometry = sz(this.orderTrackedNodes(id));
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                if (this.geometry)
                  // FIX typing
                  GeometryUtils.emitSize(
                    this.host as LitElement,
                    this.geometry,
                  );
              }, PROPAGATE_DELAY);
            });
          }
      }
    };
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
      console.log("change detection not registered for target:", id);
      return ReconciliationUtils.noChanges();
    }
    return diff(this.host);
  }

  private async informTarget({
    target,
    curr,
    prev,
    inform,
  }: InformTargetParams): Promise<void> {
    // DECIDE this will result in running animation ignoring changes
    const diff = this.getDiff(target);
    await Promise.all(
      this.getTarget(target)
        .selector(this.host)
        .map((e, i, a) => {
          const context: InformContext = {
            index: i,
            length: a.length,
            diff,
          };
          // TODO this isn't referencing `geometry`
          return e.informStyle(
            // evalKeyframe(curr, null, context, curr),
            // curr,
            evalKeyframe(curr, prev, context, inform),
            // {
            //   // FIX this uses container width and height if there is no dedicated width setting. this is hacky
            //   height: curr.heights ? curr.heights[i] : curr.height,
            //   width: curr.widths ? curr.widths[i] : curr.width,
            //   left: curr.lefts[i],
            //   top: curr.tops[i],
            // },
            context,
          );
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
