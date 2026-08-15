import type { R2C } from "_components/r2c/r2c.mjs";
import type { LitElement } from "lit";

import type { GeometryEvent } from "../../events/types/geometry-events.types.mjs";
import type {
  ChildrenUpdateSizingReturn,
  GeometryChildrenLayoutCallback,
  GeometryChildrenProps,
} from "./children.types.mjs";

import { TimingUtils } from "../../utils/timing.utils.mjs";
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
    super(host, props, "geometry-children");
    this.layout = props.layout || (() => LayoutUtils.row({}));
    this.isRoot = props.isRoot || false;
    this.diff = props.diff;
  }

  public async onEmit(
    target: R2C,
    detail: GeometryEvent,
  ): ChildrenUpdateSizingReturn {
    this.registry.update(target, detail);
    return this.updateSizing();
  }

  private async updateSizing(): ChildrenUpdateSizingReturn {
    if (this.requested) return null;
    return this.tracer.startActiveSpan(
      "GeometryChildren.updateSizing",
      async (span) => {
        this.requested = true;

        try {
          span.addEvent("session.start");
          await TimingUtils.raf();
          span.addEvent("session.compute.start");

          const serial = this.getElements();
          const ordered = this.registry.getOrdered(serial);
          const layoutCallback = this.layout(this.host);
          const sizing = layoutCallback(ordered);

          span.addEvent("session.compute.end");

          if (this.isRoot === true) {
            span.addEvent("session.root");
            return {
              inform: GeometrySetsUtils.prepareRootStyle(sizing),
              sizing,
              type: "root" as const,
            };
          } else {
            span.addEvent("session.propagate");
            return {
              sizing,
              type: "update" as const,
            };
          }
        } finally {
          this.requested = false;
          span.end();
        }
      },
    );
  }
}
