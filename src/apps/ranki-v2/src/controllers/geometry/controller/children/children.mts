import { DebugUtils } from "_/debug/debug-utils.mjs";
import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import { assertExists, assertNotUndefined } from "_error/assertions.mjs";
import {
  ReconciliationUtils,
  type ReconciliationDiff,
} from "_utils/reconciliation.utils.mjs";
import { TimingUtils } from "_utils/timing.utils.mjs";
import type { LitElement } from "lit";
import type { InformSetProps } from "../animator/animator.types.mjs";
import type { R2CNewChildSizeEvent } from "../events/geometry-events.types.mjs";
import { GeometryControllerUtils } from "../geometry-controller-utils.mjs";
import type {
  GeometryChildrenRecord,
  GeometrySetLayoutCb,
  GeometrySetProps,
} from "../types/geometry-controller.constructor.types.mjs";
import type {
  ComponentDims,
  GeometrySetName,
} from "../types/geometry-controller.types.mjs";
import type {
  ChildrenSizing,
  ChildrenUpdateSizingReturn,
} from "./children.types.mjs";

export class GeometryChildren<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly registered = new WeakMap<R2C, ComponentDims>();
  private readonly targets: GeometryChildrenRecord<Instance>;
  private requested = false;

  constructor(host: Instance, sets: GeometryChildrenRecord<Instance>) {
    this.host = host;
    this.targets = sets;
  }

  private getSet(set: GeometrySetName): GeometrySetProps<Instance> {
    const s = this.targets && this.targets[set]!;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
      details: { id: set },
    });
    return s;
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

  public async updateSizing(
    detail: R2CNewChildSizeEvent,
    set: GeometrySetName,
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update":
        const sz = this.getSizingCallback(set);
        const ordered = this.orderTrackedNodes(set);
        const sizing = sz(this.host)(ordered);
        if (this.requested) return null;
        this.requested = true;
        return new Promise<ChildrenSizing>((resolve) => {
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;
              if (sizing)
                if (this.getIsRoot(set)) {
                  resolve({
                    type: "root",
                    sizing,
                    inform: GeometryControllerUtils.prepareRootStyle(sizing),
                  });
                } else {
                  resolve({
                    type: "update",
                    sizing,
                  });
                }
            }, PROPAGATE_DELAY);
          });
        });
      default:
        return null;
    }
  }

  registerEmit(detail: R2CNewChildSizeEvent, target: R2C) {
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
  }

  public async informSet(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    const diff = this.getDiff(props.setName);
    await Promise.all(
      this.getSet(props.setName)
        .selector(this.host)
        .map((e, i, a) => {
          const informed = GeometryControllerUtils.prepareSetElementStyle(
            i,
            a,
            diff,
            props,
            sizing,
          );
          DebugUtils.informSet({ e, host: this.host, informed, props });
          return e.informStyle(informed);
        }),
    );
  }
}
