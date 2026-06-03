import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { geometry, GeometryController } from "_/controllers/geometry.mjs";

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
  // @ts-expect-error
  private cueList!: NodeListOf<R2C>;

  @query("r2-hud-bg")
  // @ts-expect-error
  private bg!: R2HudBg;

  @geometry({
    role: "hud-scroller",
    targets: {
      bg: {
        selector: (s) => [s.bg],
      },
      sections: {
        selector: (s) => Array.from(s.cueList),
        sizing: SizingUtils.row({
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
    },
  })
  public readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--bg": "rgb(var(--scheme-yellow-2))",
        })}"
      ></r2-hud-bg>
      <r2-cue-list
        @r2-child-size=${this.geo.onChildSize("sections")}
      ></r2-cue-list>
    `;
  }
}
