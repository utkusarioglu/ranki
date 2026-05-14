import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  R2CNew,
  type AnimateableStyles,
  type ComponentDims,
  type R2Geometry,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @query("r2-icon")
  private icon!: R2C;
  @query("r2-text")
  private text!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @property()
  private index!: number;
  @property()
  private list!: HudTagListItem[];

  protected getSizeList(): R2CNew[] {
    return [this.icon, this.text];
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    const sizing = SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 5,
          end: 10,
        },
        cross: {
          start: 5,
          end: 5,
        },
      },
    );
    return { sizing };
  }

  public informStyle(pos: AnimateableStyles): void {
    const { sizing } = this.getGeometry();
    // this.animateStyle(pos, { duration: 1e3 });
    this.setStyle(pos);
    this.bg
      .setStyle({ height: sizing.height })
      .animateStyle({ width: sizing.width }, { duration: 1e3 });
    this.getSizeList().forEach((e, i) =>
      e.informStyle({
        left: sizing.lefts[i],
        top: sizing.tops[i],
      }),
    );
  }

  render() {
    const item = this.list[this.index];

    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon
        .props=${{
          icon: "mdi:home",
          color: "rgb(var(--scheme-red-1))",
          width: 24,
          height: 24,
          animation: {
            enabled: true,
            duration: 1000,
          },
        }}
        style="position: absolute;"
        @r2-child-size=${this.onChildSize}
      ></r2-icon>
      <r2-text
        .props=${item}
        style="position: absolute;"
        @r2-child-size=${this.onChildSize}
      ></r2-text>
    `;
  }
}
