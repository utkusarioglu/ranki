import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import style from "./cue-list.css?inline";
import {
  LayoutUtils,
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationRecipe } from "_store/app.getters.mjs";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static override styles = unsafeCSS(style);

  @query("r2-badge-list")
  private badgeList!: R2C;

  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @geometry<R2CueList>({
    role: "cue-list",
    getRecipe: getAnimationRecipe,
    children: {
      selector: (s) => [s.badgeList],
      layout: () =>
        LayoutUtils.row({
          main: {
            start: 10,
            gap: 10,
            end: 10,
          },
          cross: {
            start: 2,
            end: 2,
          },
        }),
    },
    watchers: {
      bg: {
        selector: (s) => [s.bg],
      },
    },
  })
  private readonly geo!: GeometryController<R2CueList>;

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -3,
          "--bg": "rgb(var(--scheme-blue-2))",
        })}"
      ></r2-hud-bg>
      <r2-badge-list @r2-geometry=${this.geo.onEmit()}></r2-badge-list>
    `;
  }
}
