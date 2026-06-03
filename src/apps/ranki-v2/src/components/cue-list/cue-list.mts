import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { geometry, GeometryController } from "_/controllers/geometry.mjs";
import style from "./cue-list.css?inline";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static override styles = unsafeCSS(style);

  @query("r2-badge-list")
  // @ts-expect-error
  private badgeList!: R2C;

  @query("r2-hud-bg")
  // @ts-expect-error
  private bg!: R2HudBg;

  @geometry({
    role: "cue-list",
    targets: {
      bg: {
        selector: (s) => [s.bg],
      },
      lists: {
        selector: (s) => [s.badgeList],
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
          "--z-index": -3,
          "--bg": "rgb(var(--scheme-blue-2))",
        })}"
      ></r2-hud-bg>
      <r2-badge-list
        @r2-child-size=${this.geo.onChildSize("lists")}
      ></r2-badge-list>
    `;
  }
}
