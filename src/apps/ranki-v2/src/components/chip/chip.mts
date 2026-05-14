import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  R2CNew,
  type AnimateableStyles,
  type ComponentDims,
  type Dims,
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
      width: max-content;
      display: flex;
      align-items: center;
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

  updateGeometry(dims: ComponentDims[]): Dims | null {
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
    const { width, height, lefts, tops } = sizing;
    const container: Dims = { height, width };

    this.setStyle({ height: container.height });
    this.getSizeList().forEach((e, i) =>
      e.animateStyle({ left: lefts[i], top: tops[i] }, { duration: 1000 }),
    );
    this.bg
      .setStyle({ height: container.height })
      .animateStyle({ width }, { duration: 1e3 });
    this.setSizing(sizing);
    return container;
  }

  public informStyle(pos: AnimateableStyles): void {
    this.animateStyle(pos, { duration: 1e3 });
    const dims = this.getDims();
    const watched = this.getSizeList();
    watched.forEach((e, i) => e.informStyle(dims[i]));
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
