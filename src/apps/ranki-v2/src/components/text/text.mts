import { html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { R2C } from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import type { R2TextSpan } from "./text-span.mjs";
import { repeat } from "lit/directives/repeat.js";
import { ReconciliationController } from "_controllers/reconciler/reconciler.controller.mjs";
import { reconciler } from "_controllers/reconciler/reconciler.decorator.mjs";
import style from "./text.css?inline";
import {
  LayoutUtils,
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";

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
  private accessor props!: R2TextProps;

  @queryAll("r2-text-span")
  private accessor spans!: NodeListOf<R2TextSpan>;

  @geometry<R2Text>({
    role: "text",
    collection: getAnimationCollection,
    children: {
      selector: (s) => Array.from(s.spans),
      layout: () => LayoutUtils.last(),
      diff: (s) => s.subtree.curr.diff,
    },
  })
  private readonly geo!: GeometryController<R2Text>;

  @reconciler<R2Text, R2TextProps>({
    type: "last",
    reconcile: (c, p) => (c.text === p.text ? "retain" : "add"),
    source: (s) => [s.props],
    on: (s, type, { index }) => {
      if (type === "leave") {
        s.spans[index]!.leave();
      }
    },
  })
  private readonly subtree!: ReconciliationController<R2Text, R2TextProps>;

  override render() {
    return html`${repeat(
      this.subtree.curr.list,
      (v) => v.id,
      (p) =>
        html`<r2-text-span 
          .props=${p.props} 
          @r2-reconciler=${this.subtree.onEmit(p.id)}
          @r2-geometry=${this.geo.onEmit()}
        ></r2-text-span`,
    )}`;
  }
}
