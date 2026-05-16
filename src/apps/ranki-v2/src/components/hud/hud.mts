import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  R2C,
  type ComponentDims,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static override styles = css`
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

  protected override updateSizing(dims: ComponentDims[]): R2Sizing {
    const sizing = SizingUtils.row(dims.map((d) => d.dims));
    setTimeout(() => {
      this.informStyle({
        ...sizing,
        top: 0,
        left: 0,
        ordinal: { index: 0, length: 0, changeIndex: 0 },
      });
    }, PROPAGATE_DELAY);
    return sizing;
  }

  /**
   * @dev
   * #1 5 for scrollbar thickness, 10 for top padding, 5 for bottom padding
   */
  protected override async updateStyle(
    { height, tops, lefts }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    this.setStyle({ height: height! + 5 + 10 + 5 }); // #1
    this.informSubtreeStyles({ tops, lefts });
  }

  protected override getSubtreeList(): R2C[] {
    return [this.scroller];
  }

  override render() {
    return html`
      <div class="rotate">
        <div class="content">
          <r2-hud-scroller @r2-child-size=${this.onChildSize}></r2-hud-scroller>
        </div>
      </div>
    `;
  }
}
