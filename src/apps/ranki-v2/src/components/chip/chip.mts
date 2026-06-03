import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { html, unsafeCSS, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import {
  geometry,
  GeometryController,
} from "_/controllers/geometry/geometry.mjs";
import style from "./chip.css?inline";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static override styles = unsafeCSS(style);

  @property({ type: Boolean, reflect: true })
  leave = false;

  @query("r2-icon")
  // @ts-expect-error
  private icon!: R2C;

  @query("r2-text")
  // @ts-expect-error
  private text!: R2C;

  @query("r2-hud-bg")
  // @ts-expect-error
  private bg!: R2HudBg;

  @property()
  private index!: number;

  @property()
  private list!: HudTagListItem[];

  @geometry({
    role: "chip",
    on: (_s, action) => {
      console.log("on", action);
      // if (action === "exit") s.emitLeave();
    },
    targets: {
      content: {
        selector: (s) => [s.icon, s.text],
        sizing: SizingUtils.row({
          main: {
            start: 10,
            gap: 5,
            end: 10,
          },
          cross: {
            start: 5,
            end: 5,
          },
        }),
      },
      bg: {
        selector: (s) => [s.bg],
      },
    },
  })
  public readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

  private async animateLeave(_index: number) {
    return this.geo.informStyle(
      { width: 0, opacity: 0 },
      { index: 0, length: 1, stagger: [0] },
    );
  }

  override updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
      this.animateLeave(this.index).then(() => {
        this.emitLeave();
      });
    }
  }

  override render() {
    const item = this.list[this.index];

    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon
        .props=${{
          icon: "mdi:home",
          color: "rgb(var(--scheme-orange-2))",
          width: 24,
          height: 24,
          animation: {
            enabled: true,
            duration: 1000,
          },
        }}
        style="position: absolute;"
        @r2-child-size=${this.geo.onChildSize("content")}
      ></r2-icon>
      <r2-text
        .props=${item}
        style="position: absolute;"
        @r2-child-size=${this.geo.onChildSize("content")}
      ></r2-text>
    `;
  }
}
