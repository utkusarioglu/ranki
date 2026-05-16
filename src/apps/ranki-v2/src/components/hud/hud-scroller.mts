import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type ComponentDims,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, query } from "lit/decorators.js";
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

  @query("r2-cue-list")
  private cueList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected override getSubtreeList(): R2C[] {
    return [this.cueList];
  }

  override updateSizing(dims: ComponentDims[]): R2Sizing | null {
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
    return sizing;
  }

  protected override async updateStyle(
    { width, height, tops, lefts, subtree: { index, length } }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.setStyle({ height, zIndex: length - index }).animateStyle(
      "size",
      {
        width,
      },
      {
        duration: 1e3,
      },
    );
    this.bg.informStyle({
      left: 0,
      top: 0,
      subtree: { index: -1, length: 0, changeIndex: -1 },
      width,
      height,
    });
    this.informSubtreeStyles({ tops, lefts });
  }

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--border": "green solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-cue-list @r2-child-size=${this.onChildSize}></r2-cue-list>
    `;
  }
}
