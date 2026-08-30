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

  constructor(host: Instance, props: GeometryChildrenProps<Instance>) {
    super(host, props);
    this.layout = props.layout || (() => LayoutUtils.row({}));
    this.diff = props.diff;
  }

  public onEmit({ target, detail }: GeometryChildrenOnEmitProps) {
    this.registry.update(target, detail);
    return this.updateSizing();
  }

  // public async onEmit_old(
  //   target: R2C,
  //   detail: GeometryEvent,
  // ): ChildrenUpdateSizingReturn {
  //   this.registry.update(target, detail);
  //   return this.updateSizing();
  // }

  private updateSizing() {
    return this.o11y.trace.span("updateSizing", () => {
      const serial = this.getElements();
      const ordered = this.registry.getOrdered(serial);
      const layoutCallback = this.layout(this.host);
      const sizing = layoutCallback(ordered);
      return sizing;
    });
  }

  // private async updateSizing_old(): ChildrenUpdateSizingReturn {
  //   if (this.session.isActive()) {
  //     return {
  //       session: this.session.join(),
  //       type: "terminate",
  //     };
  //   }
  //   return this.o11y.trace.span("updateSizing", async ({ span, withCtx }) => {
  //     try {
  //       const session = withCtx(
  //         {
  //           "geometry.session.tag": this.host.tagName,
  //         },
  //         () => this.session.start(),
  //       );
  //       span.addEvent("session.start");
  //       await TimingUtils.raf();
  //       span.addEvent("session.compute.start");

  //       const serial = this.getElements();
  //       const ordered = this.registry.getOrdered(serial);
  //       const layoutCallback = this.layout(this.host);
  //       const sizing = layoutCallback(ordered);

  //       span.addEvent("session.compute.end");

  //       if (this.isRoot === true) {
  //         span.addEvent("session.root");
  //         return {
  //           inform: GeometrySetsUtils.prepareRootStyle(sizing),
  //           session,
  //           sizing,
  //           type: "root" as const,
  //         };
  //       } else {
  //         span.addEvent("session.propagate");
  //         return {
  //           session,
  //           sizing,
  //           type: "update" as const,
  //         };
  //       }
  //     } finally {
  //       this.session.end();
  //       // this.inSession = false;
  //     }
  //   });
  // }
}
