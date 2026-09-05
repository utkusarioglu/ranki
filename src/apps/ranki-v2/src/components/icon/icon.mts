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
import { getAnimationCollection } from "_store/store.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import type { R2IconSpan } from "./icon-span.mjs";

import style from "./icon.css?inline";

export type Parts = {
  id: number;
  leave: boolean;
  props: R2IconProps;
};

export interface R2IconProps {
  animation: RankiPropAnimationBlock;
  color: string;
  height: number;
  icon: string;
  width: number;
}

@customElement("r2-icon")
export class R2Icon extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    children: {
      diff: (s) => s.subtree.curr.diff,
      layout: () => LayoutUtils.last(),
    },
    collection: getAnimationCollection,
    role: "icon",
  })
  private readonly geo!: GeometryController<R2Icon>;

  @property()
  private accessor props!: R2IconProps;

  @queryAll("r2-icon-span")
  private accessor spans!: NodeListOf<R2IconSpan>;

  @reconciler<R2Icon, R2IconProps>({
    on: (s, type, { index }) => {
      if (type === "leave") {
        s.spans[index]!.leave();
      }
    },
    reconcile: (c, p) => (c.icon === p.icon ? "retain" : "add"),
    source: (s) => [s.props],
    type: "last",
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
          @r2-geometry=${this.geo.child()}
        ></r2-icon-span>`,
    )}`;
  }
}
