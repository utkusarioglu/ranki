import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type AnimateableStyles,
  type ComponentDims,
  type InformStyle,
  type R2Geometry,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected getSizeList(): R2C[] {
    return [this.badgeList];
  }

  updateGeometry(dims: ComponentDims[]): R2Geometry | null {
    const sizing = SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
      },
    );
    return { sizing };
  }

  public informStyle({ index, length, top, left }: InformStyle) {
    const {
      sizing: { width, height, lefts, tops },
    } = this.getGeometry();
    this.setStyle({ zIndex: length - index }).animateStyle(
      "position",
      { top, left },
      { duration: 1e3 },
    );

    this.bg.informStyle({ top, left, width, height, index: -1, length: 0 });
    this.getSizeList().forEach((e, i, a) =>
      e.informStyle({
        index: i,
        length: a.length,
        left: lefts[i],
        top: tops[i],
      }),
    );
  }

  render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -3,
          "--border": "pink solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-badge-list @r2-child-size=${this.onChildSize}></r2-badge-list>
    `;
  }
}
