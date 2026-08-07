import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import { TimingUtils } from "_utils/timing.utils.mjs";

import type { R2CNewChildSizeEvent } from "../../events/geometry-events.types.mjs";
import type {
  ChildrenUpdateSizingReturn,
  GeometryChildrenLayoutCallback,
  GeometryChildrenProps,
} from "./children.types.mjs";

import { GeometrySetsUtils } from "../geometry-sets-utils.mjs";
import { WatcherSet } from "../watcher-set/watcher-set.mjs";
import { LayoutUtils } from "./layout/layout-utils.mjs";
import { ChildrenRegistry } from "./registry/children-registry.mjs";

export class GeometryChildren<
  Instance extends LitElement,
> extends WatcherSet<Instance> {
  private readonly isRoot: boolean;
  private readonly layout: GeometryChildrenLayoutCallback;
  private readonly registry = new ChildrenRegistry();
  private requested = false;

  constructor(host: Instance, props: GeometryChildrenProps<Instance>) {
    super(host, props);
    this.layout = props.layout || (() => LayoutUtils.row({}));
    this.isRoot = props.isRoot || false;
    this.diff = props.diff;
  }

  public async onEmit(
    target: R2C,
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    this.registry.update(target, detail);
    return this.updateSizing(detail);
  }

  private async composeResolution(): ChildrenUpdateSizingReturn {
    if (this.requested) return null;
    this.requested = true;

    await TimingUtils.raf();

    const serial = this.getElements();
    const ordered = this.registry.getOrdered(serial);
    const layoutCallback = this.layout(this.host);
    const sizing = layoutCallback(ordered);

    this.requested = false;

    if (this.isRoot === true)
      return {
        inform: GeometrySetsUtils.prepareRootStyle(sizing),
        sizing,
        type: "root",
      };

    return {
      sizing,
      type: "update",
    };
  }

  private async updateSizing(
    detail: R2CNewChildSizeEvent,
  ): ChildrenUpdateSizingReturn {
    switch (detail.intent) {
      case "leave":
      case "update": {
        return this.composeResolution();
      }
      default:
        return null;
    }
  }
}
