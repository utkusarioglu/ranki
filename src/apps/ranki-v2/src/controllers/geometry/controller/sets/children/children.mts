import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import { TimingUtils } from "_utils/timing.utils.mjs";
import type { LitElement } from "lit";
import type { R2CNewChildSizeEvent } from "../../events/geometry-events.types.mjs";
import type { ComponentDims } from "../../types/geometry-controller.types.mjs";
import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { WatcherSet } from "../single/single.mjs";
import type {
  ChildrenSizing,
  ChildrenUpdateSizingReturn,
  GeometryChildrenProps,
  GeometrySetLayoutCb,
} from "./children.types.mjs";

export class GeometryChildren<
  Instance extends LitElement,
> extends WatcherSet<Instance> {
  private readonly layout: GeometrySetLayoutCb;
  private readonly isRoot: boolean;
  private readonly dims = new WeakMap<R2C, ComponentDims>();
  private requested = false;

  constructor(host: Instance, props: GeometryChildrenProps<Instance>) {
    super(host, props);
    this.layout = props.layout;
    this.isRoot = props.isRoot || false;
    this.diff = props.diff;
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
      assertNotUndefined(dims, {
        why: "Element has no registered component dims",
      });
      ordered.push(dims);
    }
    return ordered;
  }

  private async updateSizing(
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update":
        const ordered = this.orderChildren();
        const sizing = this.layout(this.host)(ordered);
        if (this.requested) return null;
        this.requested = true;
        return this.composeResolution(sizing);
      default:
        return null;
    }
  }

  private async composeResolution(
    sizing: LayoutSizing | null,
  ): Promise<ChildrenSizing> {
    await TimingUtils.raf();
    return new Promise<ChildrenSizing>((resolve) => {
      setTimeout(() => {
        this.requested = false;
        if (sizing)
          if (this.isRoot === true) {
            resolve({
              type: "root",
              sizing,
              inform: GeometrySetsUtils.prepareRootStyle(sizing),
            });
          } else {
            resolve({
              type: "update",
              sizing,
            });
          }
      }, PROPAGATE_DELAY);
    });
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
}
