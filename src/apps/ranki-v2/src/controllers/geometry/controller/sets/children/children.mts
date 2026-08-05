import { DebugUtils } from "_/debug/debug-utils.mjs";
import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
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
} from "./children.types.mjs";

export class GeometryChildren<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly dims = new WeakMap<R2C, ComponentDims>();
  private readonly props: GeometryChildrenProps<Instance>;
  private requested = false;

  constructor(host: Instance, props: GeometryChildrenProps<Instance>) {
    this.host = host;
    this.props = props;
  }

  private getElements() {
    return this.props.selector(this.host);
  }

  public async onEmit(target: R2C, detail: R2CNewChildSizeEvent) {
    this.registerEmit(detail, target);
    return this.updateSizing(detail);
  }

  private orderChildren() {
    const serial = this.getElements();
    const ordered: ComponentDims[] = [];
    for (let component of serial) {
      const dims = this.dims.get(component);
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
    const diff = this.props.diff;
    if (!diff) {
      // console.log("diff detection not registered for target:", id);
      return ReconciliationUtils.noChanges();
    }
    return diff(this.host);
  }

  private async updateSizing(
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update":
        const layout = this.props.layout;
        const ordered = this.orderChildren();
        const sizing = layout(this.host)(ordered);
        if (this.requested) return null;
        this.requested = true;
        return new Promise<ChildrenSizing>((resolve) => {
          TimingUtils.raf().then(() => {
            setTimeout(() => {
              this.requested = false;
              if (sizing)
                if (this.props.isRoot === true) {
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

  private registerEmit(detail: R2CNewChildSizeEvent, target: R2C) {
    switch (detail.intent) {
      case "leave":
        this.dims.set(target, {
          intent: detail.intent,
          style: {
            width: 0,
            height: 0,
          },
        });
        break;
      case "disconnected":
        this.dims.delete(target);
        break;
      case "update":
        if (this.dims.has(target)) {
          this.dims.set(target, {
            intent: detail.intent,
            style: detail.style,
            // ...detail.rect,
          });
        } else {
          this.dims.set(target, {
            intent: "enter",
            style: detail.style,
          });
        }
        break;
      case "mode":
        this.dims.set(
          target,
          // @ts-expect-error
          {
            ...this.dims.get(target),
            intent: "enter",
            mode: detail.mode,
          },
        );
    }
  }

  public async inform(
    props: InformSetProps,
    sizing: LayoutSizing | null,
  ): Promise<void> {
    const diff = this.getDiff();
    await Promise.all(
      this.getElements().map((e, i, a) => {
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
