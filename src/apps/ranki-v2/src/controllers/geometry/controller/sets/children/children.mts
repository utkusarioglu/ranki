import type { R2C } from "_components/r2c/r2c.mjs";
import type { LayoutSizing } from "_controllers/geometry/layout/layout-utils.types.mjs";
import type { LitElement } from "lit";

import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";
import { TimingUtils } from "_utils/timing.utils.mjs";

import type { R2CNewChildSizeEvent } from "../../events/geometry-events.types.mjs";
import type { ComponentDims } from "../../types/geometry-controller.types.mjs";
import type {
  ChildrenSizing,
  ChildrenUpdateSizingReturn,
  GeometryChildrenProps,
  GeometrySetLayoutCb,
} from "./children.types.mjs";

import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { WatcherSet } from "../watcher-set/watcher-set.mjs";

export class GeometryChildren<
  Instance extends LitElement,
> extends WatcherSet<Instance> {
  private readonly dims = new WeakMap<R2C, ComponentDims>();
  private readonly isRoot: boolean;
  private readonly layout: GeometrySetLayoutCb;
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
              inform: GeometrySetsUtils.prepareRootStyle(sizing),
              sizing,
              type: "root",
            });
          } else {
            resolve({
              sizing,
              type: "update",
            });
          }
      }, PROPAGATE_DELAY);
    });
  }

  private orderChildren() {
    const serial = this.getElements();
    const ordered: ComponentDims[] = [];
    for (const component of serial) {
      const dims = this.dims.get(component);
      assertNotUndefined(dims, {
        why: "Element has no registered component dims",
      });
      ordered.push(dims);
    }
    return ordered;
  }

  /**
   * @dev
   * #1 This crates uncertainty about what properties exist in the object retrieved from the map
   */
  private registerEmit(detail: R2CNewChildSizeEvent, target: R2C) {
    switch (detail.intent) {
      case "disconnected":
        this.dims.delete(target);
        break;
      case "leave":
        this.dims.set(target, {
          intent: detail.intent,
          style: {
            height: 0,
            width: 0,
          },
        });
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
          // @ts-expect-error #1
          {
            ...this.dims.get(target),
            intent: "enter",
            mode: detail.mode,
          },
        );
    }
  }

  private async updateSizing(
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update": {
        const ordered = this.orderChildren();
        const sizing = this.layout(this.host)(ordered);
        if (this.requested) return null;
        this.requested = true;
        return this.composeResolution(sizing);
      }
      default:
        return null;
    }
  }
}
