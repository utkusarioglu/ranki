import type { LitElement } from "lit";

import type {
  GeometryChildrenLayoutCallback,
  GeometryChildrenOnEmitProps,
  GeometryChildrenProps,
} from "./children.types.mjs";

import { WatcherSet } from "../watcher-set/watcher-set.mjs";
import { LayoutUtils } from "./layout/layout-utils.mjs";
import { ChildrenRegistry } from "./registry/children-registry.mjs";
import type { LayoutSizing } from "./layout/layout-utils.types.mjs";
import { assertTrue } from "_error/assertions.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";

export class GeometryChildren<
  Instance extends LitElement,
> extends WatcherSet<Instance> {
  private readonly layout: GeometryChildrenLayoutCallback;
  private readonly registry = new ChildrenRegistry();

  constructor(host: Instance, props?: GeometryChildrenProps<Instance>) {
    super(host);
    this.layout = props?.layout || (() => LayoutUtils.row({}));
    if (props?.diff) this.diff = props.diff;
  }

  public onEmit({ detail, target }: GeometryChildrenOnEmitProps): LayoutSizing {
    this.registry.update(target, detail);
    return this.updateSizing();
  }

  // public add = this.addElement;
  public add(elem: R2C) {
    this.registry.update(elem, { type: "lifecycle", lifecycle: "connected" });
    this.addElement(elem);
  }
  public remove = this.removeElement;

  private updateSizing(): LayoutSizing {
    return this.o11y.trace.span("updateSizing", () => {
      const serial = this.getElements();
      const ordered = this.registry.getOrdered(serial);
      assertTrue(serial.length === ordered.length, {
        why: "Element count does not match the registry size",
        details: {
          serial,
          ordered,
        },
      });
      const layoutCallback = this.layout(this.host);
      return layoutCallback(ordered);
    });
  }
}
