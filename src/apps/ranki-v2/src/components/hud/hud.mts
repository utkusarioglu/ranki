import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { type UpdateStyle } from "_/controllers/geometry.types.mjs";
import { type R2Sizing } from "_/controllers/geometry.types.mjs";
import { type ComponentDims } from "_/controllers/geometry.types.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import styles from "./hud.css?inline";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static override styles = unsafeCSS(styles);

  @query("r2-hud-scroller")
  private scroller!: R2C;

  protected override updateSizing(dims: ComponentDims[]): R2Sizing {
    const sizing = SizingUtils.row()(dims);
    setTimeout(() => {
      this.informStyle({
        ...sizing,
        top: 0,
        left: 0,
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
