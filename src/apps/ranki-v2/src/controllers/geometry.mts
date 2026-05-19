import type { LitElement, ReactiveController, ReactiveElement } from "lit";
import type {
  GeometryParams,
  SizingCallback,
  SizingSelector,
  ComponentDims,
  Dims,
  R2CNewChildSizeEvent,
  R2Sizing,
  InformStyle,
  InformContext,
  UpdateStyle,
  ReconcilerChangesMapCb,
} from "./geometry.types.mts";
import type { R2C } from "_components/r2c/r2c.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { GeometryUtils } from "./geometry.utils.mts";
import { assertNotNull } from "_error/assertions.mjs";
import { Animator } from "./geometry.animator.mts";
import { assertExists } from "../../../../packages/dqm-utils/src/assertions.mts";
import type { InformTargetParams } from "./geometry.animator.types.mts";
import {
  ReconciliationUtils,
  type ReconciliationChanges,
} from "_utils/reconciliation.mjs";

type HostType = LitElement;

export class GeometryController implements ReactiveController {
  private readonly host: HostType;
  private readonly updateSizing: SizingCallback;
  private readonly selector: SizingSelector;
  private readonly registered = new WeakMap<R2C, Dims>();
  private readonly animator: Animator;
  private readonly changes: ReconcilerChangesMapCb;
  private geometry: R2Sizing | null = null;
  private requested = false;
  private currStyle: UpdateStyle | null = null;

  constructor(host: HostType, params: GeometryParams) {
    host.addController(this);
    this.updateSizing = params.sizing;
    this.selector = params.selector;
    this.host = host;
    this.changes = params.changes;
    this.animator = new Animator(this.host, params.role, this.informTarget);
  }

  private getTarget(id: string) {
    const s = this.selector[id]!;
    assertExists(s, { why: "Subtree selector hasn't been registered" });
    return s(this.host);
  }

  private getSubtreeList() {
    const s = this.selector["subtree"]!;
    assertExists(s, { why: "Subtree selector hasn't been registered" });
    return s(this.host);
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

  onChildSize() {
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
          this.geometry = this.updateSizing(this.orderTrackedNodes());
          if (!this.requested) {
            this.requested = true;
            TimingUtils.raf().then(() => {
              setTimeout(() => {
                this.requested = false;
                // if (this.geometry) this.emitSize(this.geometry);
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

  private orderTrackedNodes() {
    const serial = this.getSubtreeList();
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

  private async informTarget(
    { target, curr }: InformTargetParams,
    // target: string,
    // curr: InformTargetStyles,
    // changes: ReconciliationChanges,
  ): Promise<void> {
    // DECIDE this will result in running animation ignoring changes
    const changes = this.getChanges(target);
    await Promise.all(
      this.getTarget(target).map((e, i, a) =>
        e.informStyle(
          {
            height: curr.heights ? curr.heights[i] : undefined,
            width: curr.widths ? curr.widths[i] : undefined,
            left: curr.lefts[i],
            top: curr.tops[i],
          },
          {
            index: i,
            length: a.length,
            changes,
          },
        ),
      ),
    );
  }

  private getChanges(target: string): ReconciliationChanges {
    const t = this.changes[target];
    if (!t) {
      console.log("change detection not registered for target:", target);
      return ReconciliationUtils.noChanges();
    }
    return t();
  }

  // public async informSubtreeStyles(
  //   curr: InformSubtreeStyles,
  //   changes: ReconciliationChanges,
  // ): Promise<void> {
  //   await Promise.all(
  //     this.getSubtreeList().map((e, i, a) =>
  //       e.informStyle(
  //         {
  //           left: curr.lefts[i],
  //           top: curr.tops[i],
  //         },
  //         {
  //           index: i,
  //           length: a.length,
  //           changes,
  //         },
  //       ),
  //     ),
  //   );
  // }

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
