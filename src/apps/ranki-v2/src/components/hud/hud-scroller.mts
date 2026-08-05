import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { LayoutUtils } from "_controllers/geometry/layout/layout-utils.mjs";
import { css, html } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { GeometryController } from "_controllers/geometry/controller/geometry-controller.mjs";
import { geometry } from "_controllers/geometry/decorator/geometry-decorator.mjs";

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

  @queryAll("r2-cue-list")
  private cueList!: NodeListOf<R2C>;

  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @geometry<R2HudScroller>({
    role: "hud-scroller",
    children: {
      selector: (s) => Array.from(s.cueList),
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
  private readonly geo!: GeometryController<R2HudScroller>;

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--bg": "rgb(var(--scheme-yellow-2))",
        })}"
      ></r2-hud-bg>
      <r2-cue-list
        @r2-geometry=${this.geo.onEmit({ set: "sections" })}
      ></r2-cue-list>
    `;
  }
}
