import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";

import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import style from "./cue-list.css?inline";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static override styles = unsafeCSS(style);

  @query("r2-badge-list")
  private accessor badgeList!: R2C;

  @query("r2-hud-bg")
  private accessor bg!: R2HudBg;

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
      selector: (s) => [s.badgeList],
    },
    collection: getAnimationCollection,
    role: "cue-list",
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
          "--bg": "rgb(var(--scheme-blue-2))",
          "--z-index": -3,
        })}"
      ></r2-hud-bg>
      <r2-badge-list @r2-geometry=${this.geo.onEmit()}></r2-badge-list>
    `;
  }
}
