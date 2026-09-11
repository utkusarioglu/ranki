import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import { assertTrue } from "_error/assertions.mjs";

import type {
  GeometryChildrenLayoutCallback,
  GeometryChildrenOnEmitProps,
  GeometryChildrenProps,
} from "./children.types.mjs";
import type { LayoutSizing } from "./layout/layout-utils.types.mjs";

import { WatcherSet } from "../watcher-set/watcher-set.mjs";
import { LayoutUtils } from "./layout/layout-utils.mjs";
import { ChildrenRegistry } from "./registry/children-registry.mjs";

export class GeometryChildren<
  Instance extends LitElement,
> extends WatcherSet<Instance> {
  public remove = this.removeElement;
  private readonly layout: GeometryChildrenLayoutCallback;

  private readonly registry = new ChildrenRegistry();

  constructor(host: Instance, props?: GeometryChildrenProps<Instance>) {
    super(host);
    this.layout = props?.layout || (() => LayoutUtils.row({}));
    if (props?.diff) this.diff = props.diff;
  }

  // public add = this.addElement;
  public add(elem: R2C) {
    this.registry.update(elem, { lifecycle: "connected", type: "lifecycle" });
    this.addElement(elem);
  }
  public onEmit({ detail, target }: GeometryChildrenOnEmitProps): LayoutSizing {
    this.registry.update(target, detail);
    return this.updateSizing();
  }

  private updateSizing(): LayoutSizing {
    return this.o11y.trace.span("updateSizing", () => {
      const serial = this.getElements();
      const ordered = this.registry.getOrdered(serial);
      assertTrue(serial.length === ordered.length, {
        details: {
          ordered,
          serial,
        },
        why: "Element count does not match the registry size",
      });
      const layoutCallback = this.layout(this.host);
      return layoutCallback(ordered);
    });
  }
}
