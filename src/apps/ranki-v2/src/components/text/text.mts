import { html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { R2C } from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2TextSpan } from "./text-span.mts";
import { repeat } from "lit/directives/repeat.js";
import { SizingUtils } from "_utils/Sizing.mjs";
import {
  geometry,
  type GeometryController,
} from "_/controllers/geometry/geometry.mjs";
import {
  reconciler,
  ReconciliationController,
} from "_/controllers/reconciler/reconciler.mjs";
import style from "./text.css?inline";

export interface R2TextProps {
  animation: RankiPropAnimationBlock;
  text: string;
  color: string;
}

export type Parts = {
  id: number;
  props: R2TextProps;
  leave: boolean;
};

@customElement("r2-text")
export class R2Text extends R2C {
  static override styles = unsafeCSS(style);
  @property()
  // @ts-expect-error
  private props!: R2TextProps;

  @queryAll("r2-text-span")
  // @ts-expect-error
  private spans!: NodeListOf<R2TextSpan>;

  @geometry({
    role: "text",
    targets: {
      "text-span": {
        selector: (s) => Array.from(s.spans),
        sizing: SizingUtils.last(),
      },
    },
  })
  public readonly geo!: GeometryController;

  @reconciler<R2TextProps>({
    type: "single",
    reconcile: (c, p) => (c.text === p.text ? "retain" : "add"),
    source: (s) => [s.props],
  })
  private readonly subtree!: ReconciliationController<R2TextProps>;

  override informStyle = this.geo.informStyle.bind(this.geo);

  override render() {
    return html`${repeat(
      this.subtree.curr.list,
      (v) => v.id,
      (p) =>
        html`<r2-text-span 
          .props=${p.props} 
          ?leave=${p.leave} 
          @r2-child-leave=${this.subtree.onLeave(p.id)}
          @r2-child-size=${this.geo.onChildSize("text-span")}
        ></r2-text-span`,
    )}`;
  }
}
