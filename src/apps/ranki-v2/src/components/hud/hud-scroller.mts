import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/store.mjs";
import { html, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import style from "./hud-scroller.css?inline";

@customElement("r2-hud-scroller")
export class R2HudScroller extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    children: {
      layout: () =>
        LayoutUtils.row({
          cross: {
            end: 2,
            start: 2,
          },
          main: {
            end: 10,
            gap: 10,
            start: 10,
          },
        }),
    },
    collection: getAnimationCollection,
    role: "hud-scroller",
  })
  private readonly geo!: GeometryController<R2HudScroller>;

  override render() {
    return html`
      <r2-hud-bg
        @r2-geometry=${this.geo.watcher()}
        style="${styleMap({
          "--bg": "rgb(var(--scheme-yellow-2))",
          "--z-index": -4,
        })}"
      ></r2-hud-bg>

      <r2-notification-list
        class="elems"
        @r2-geometry=${this.geo.child()}
      ></r2-notification-list>

      <r2-cue-list class="elems" @r2-geometry=${this.geo.child()}></r2-cue-list>
    `;
  }
}
