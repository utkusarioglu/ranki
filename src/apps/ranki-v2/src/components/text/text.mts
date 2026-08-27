import type { RankiPropAnimationBlock } from "_config/config.types.mjs";

import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import {
  reconciler,
  ReconciliationController,
} from "_controllers/reconciler/reconciler.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import type { R2TextSpan } from "./text-span.mjs";

import style from "./text.css?inline";

export type Parts = {
  id: number;
  leave: boolean;
  props: R2TextProps;
};

export interface R2TextProps {
  animation: RankiPropAnimationBlock;
  color: string;
  text: string;
}

@customElement("r2-text")
export class R2Text extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    children: {
      diff: (s) => s.subtree.curr.diff,
      layout: () => LayoutUtils.last(),
      selector: (s) => Array.from(s.spans),
    },
    collection: getAnimationCollection,
    role: "text",
  })
  private readonly geo!: GeometryController<R2Text>;

  @property()
  private accessor props!: R2TextProps;

  @queryAll("r2-text-span")
  private accessor spans!: NodeListOf<R2TextSpan>;

  @reconciler<R2Text, R2TextProps>({
    on: (s, type, { index }) => {
      if (type === "leave") {
        s.spans[index]!.leave();
      }
    },
    reconcile: (c, p) => (c.text === p.text ? "retain" : "add"),
    source: (s) => [s.props],
    type: "last",
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
