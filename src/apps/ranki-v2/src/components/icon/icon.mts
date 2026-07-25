import { html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { R2C } from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2IconSpan } from "./icon-span.mjs";
import { repeat } from "lit/directives/repeat.js";
import { LayoutUtils } from "_controllers/geometry/layout/layout-utils.mjs";
import { GeometryController } from "_controllers/geometry/controller/geometry.controller.mjs";
import { geometry } from "_controllers/geometry/decorator/geometry.decorator.mjs";
import style from "./icon.css?inline";
import { ReconciliationController } from "_controllers/reconciler/reconciler.controller.mjs";
import { reconciler } from "_controllers/reconciler/reconciler.decorator.mjs";

export interface R2IconProps {
  animation: RankiPropAnimationBlock;
  icon: string;
  color: string;
  width: number;
  height: number;
}

export type Parts = {
  id: number;
  props: R2IconProps;
  leave: boolean;
};

@customElement("r2-icon")
export class R2Icon extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  private props!: R2IconProps;

  @queryAll("r2-icon-span")
  private spans!: NodeListOf<R2IconSpan>;

  @geometry<R2Icon>({
    role: "icon",
    targets: {
      "icon-span": {
        selector: (s) => Array.from(s.spans),
        layout: () => LayoutUtils.last(),
        diff: (s) => s.subtree.curr.diff,
      },
    },
  })
  private readonly geo!: GeometryController<R2Icon>;

  @reconciler<R2Icon, R2IconProps>({
    type: "last",
    reconcile: (c, p) => (c.icon === p.icon ? "retain" : "add"),
    source: (s) => [s.props],
    on: (s, type, { index }) => {
      if (type === "leave") {
        s.spans[index]!.leave();
      }
    },
  })
  private readonly subtree!: ReconciliationController<R2Icon, R2IconProps>;

  override render() {
    return html`${repeat(
      this.subtree.curr.list,
      (v) => v.id,
      (p) =>
        html`<r2-icon-span
          .props=${p.props}
          @r2-reconciler=${this.subtree.onEmit(p.id)}
          @r2-geometry=${this.geo.onEmit("icon-span")}
        ></r2-icon-span`,
    )}`;
  }
}
