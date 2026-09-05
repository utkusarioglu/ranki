import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/store.mjs";
import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import styles from "./hud.css?inline";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static override styles = unsafeCSS(styles);

  @geometry({
    children: {
      layout: () =>
        LayoutUtils.row({
          cross: {
            end: 5,
            start: 10,
          },
        }),
    },
    collection: getAnimationCollection,
    isRoot: true,
    role: "hud",
  })
  private readonly geo!: GeometryController<R2Hud>;

  override render() {
    return html`
      <div class="rotate">
        <div class="content">
          <r2-hud-scroller @r2-geometry=${this.geo.child()}></r2-hud-scroller>
        </div>
      </div>
    `;
  }
}
