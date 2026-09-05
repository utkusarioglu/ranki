import type { LitElement } from "lit";

import type {
  GeometryChildrenLayoutCallback,
  GeometryChildrenOnEmitProps,
  GeometryChildrenProps,
} from "./children.types.mjs";

import { WatcherSet } from "../watcher-set/watcher-set.mjs";
import { LayoutUtils } from "./layout/layout-utils.mjs";
import { ChildrenRegistry } from "./registry/children-registry.mjs";

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

  public onEmit({ detail, target }: GeometryChildrenOnEmitProps) {
    this.registry.update(target, detail);
    return this.updateSizing();
  }

  public add = this.addElement;
  public remove = this.removeElement;

  private updateSizing() {
    return this.o11y.trace.span("updateSizing", () => {
      const serial = this.getElements();
      const ordered = this.registry.getOrdered(serial);
      const layoutCallback = this.layout(this.host);
      const sizing = layoutCallback(ordered);
      return sizing;
    });
  }
}
