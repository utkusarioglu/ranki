import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
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

@customElement("r2-hud")
export class R2Hud extends R2C {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0;
      overflow: hidden;
    }

    :host .rotate:hover {
      &::-webkit-scrollbar-thumb {
        background: orange;
      }
    }

    :host .rotate {
      //  transform: rotate(180deg);
      position: relative;
      overflow-y: hidden;
      overflow-x: scroll;

      &::-webkit-scrollbar {
        appearance: none;
        height: 5px;
      }

      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 5px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    :host .content {
      //  transform: rotate(180deg);
      padding-top: 10px;
      padding-bottom: 5px;
      margin-inline: auto;
      padding-inline: 16px;
      overflow: hidden;
      width: max-content;
    }
  `;

  @query("r2-hud-scroller")
  private scroller!: R2C;

  updateGeometry(dims: ComponentDims[]): R2Geometry {
    const sizing = SizingUtils.row(dims.map((d) => d.dims));
    setTimeout(() => {
      this.informStyle({ ...sizing, index: 0, length: 0 });
    }, PROPAGATE_DELAY);
    return { sizing };
  }

  public informStyle(pos: InformStyle): void {
    const { height } = pos;
    // 5 for scrollbar thickness, 10 for top padding, 5 for bottom padding
    this.setStyle({ height: height! + 5 + 10 + 5 });
    // const left = -sizing.width / 2;
    // this.container.style.setProperty("width", sizing.width + "px");
    this.getSizeList().forEach((e, index, arr) =>
      e.informStyle({ index, length: arr.length }),
    );
  }

  protected getSizeList(): R2C[] {
    return [this.scroller];
  }

  render() {
    return html`
      <div class="rotate">
        <div class="content">
          <r2-hud-scroller @r2-child-size=${this.onChildSize}></r2-hud-scroller>
        </div>
      </div>
    `;
  }
}
