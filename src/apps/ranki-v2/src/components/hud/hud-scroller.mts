import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";

import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
  LayoutUtils,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { css, html } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-hud-scroller")
export class R2HudScroller extends R2C {
  static override styles = css`
    :host {
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;

  @query("r2-hud-bg")
  private accessor bg!: R2HudBg;

  @queryAll("r2-cue-list")
  private accessor cueList!: NodeListOf<R2C>;

  @geometry<R2HudScroller>({
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
      selector: (s) => Array.from(s.cueList),
    },
    collection: getAnimationCollection,
    role: "hud-scroller",
    watchers: {
      bg: {
        selector: (s) => [s.bg],
      },
    },
  })
  private readonly geo!: GeometryController<R2HudScroller>;

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--bg": "rgb(var(--scheme-yellow-2))",
          "--z-index": -4,
        })}"
      ></r2-hud-bg>
      <r2-cue-list @r2-geometry=${this.geo.onEmit()}></r2-cue-list>
    `;
  }
}
