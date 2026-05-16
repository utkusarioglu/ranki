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

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static override styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected override getSubtreeList(): R2C[] {
    return [this.badgeList];
  }

  protected override updateSizing(dims: ComponentDims[]): R2Sizing | null {
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
    {
      subtree: { index, length },
      top,
      left,
      width,
      height,
      lefts,
      tops,
    }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.setStyle({ zIndex: length - index }).animateStyle(
      "position",
      { top, left },
      { duration: 1e3 },
    );

    this.bg.informStyle({
      top,
      left,
      width,
      height,
      subtree: { index: -1, length: 0, changeIndex: -1 },
    });
    this.informSubtreeStyles({ tops, lefts });
  }

  override render() {
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
