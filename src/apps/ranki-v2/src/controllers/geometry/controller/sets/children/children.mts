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
import type { InformSetProps } from "../../animator/animator.types.mjs";
import type { R2CNewChildSizeEvent } from "../../events/geometry-events.types.mjs";
import { GeometryControllerUtils } from "../../geometry-controller-utils.mjs";
import type { ComponentDims } from "../../types/geometry-controller.types.mjs";
import type {
  ChildrenSizing,
  ChildrenUpdateSizingReturn,
  GeometryChildrenProps,
  GeometrySetLayoutCb,
} from "./children.types.mjs";

export class GeometryChildren<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly registered = new WeakMap<R2C, ComponentDims>();
  private readonly props: GeometryChildrenProps<Instance>;
  private requested = false;

  constructor(host: Instance, props: GeometryChildrenProps<Instance>) {
    this.host = host;
    this.props = props;
  }

  private getSet(): GeometryChildrenProps<Instance> {
    const s = this.props && this.props;
    assertExists(s, {
      why: "Subtree selector hasn't been registered",
    });
    return s;
  }

  private getIsRoot(): boolean {
    const set = this.getSet();
    return !!set.isRoot;
  }

  private getSizingCallback(): GeometrySetLayoutCb {
    const set = this.getSet();
    const layout = set.layout;
    assertNotUndefined(layout, {
      why: "No sizing registered",
    });
    return layout;
  }

  private orderTrackedNodes() {
    const set = this.getSet();
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

  private getDiff(): ReconciliationDiff {
    const set = this.getSet();
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
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update":
        const sz = this.getSizingCallback();
        const ordered = this.orderTrackedNodes();
        const sizing = sz(this.host)(ordered);
        if (this.requested) return null;
        this.requested = true;
        return new Promise<ChildrenSizing>((resolve) => {
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;
              if (sizing)
                if (this.getIsRoot()) {
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
    const diff = this.getDiff();
    await Promise.all(
      this.getSet()
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
