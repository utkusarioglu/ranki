import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type AnimateableStyles,
  type ComponentDims,
  type R2Geometry,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;

  @query("r2-cue-list")
  private cueList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected getSizeList(): R2C[] {
    return [this.cueList];
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

  public informStyle(pos: AnimateableStyles) {
    const { sizing } = this.getGeometry();
    // this.animateStyle("position", pos, { duration: 1e3 });
    this.setStyle(pos);
    this.animateStyle("position", pos, { duration: 1e3 });
    this.bg.informStyle({ ...pos, width: sizing.width, height: sizing.height });
    this.getSizeList().forEach((e, i) =>
      e.informStyle({
        left: sizing.lefts[i],
        top: sizing.tops[i],
      }),
    );
  }

  render() {
    return html`<div>
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--border": "green solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-cue-list @r2-child-size=${this.onChildSize}></r2-cue-list>
    </div>`;
  }
}
