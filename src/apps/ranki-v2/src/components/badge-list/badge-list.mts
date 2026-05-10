import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, queryAll } from "lit/decorators.js";

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: 1em;
      white-space: nowrap;
    }
  `;
  @queryAll("r2-chip")
  private chips!: NodeListOf<R2C>;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions(this.chips, (dims) => {
      const { width, height } = SizingUtils.column(dims);
      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public animateStyle(pos: AnimateableStyles): void {
    super.animateStyle(pos, { duration: 1000 });
    this.chips.forEach((e) => e.informStyle(pos));
  }

  render() {
    return html`
      <div>
        badge-list
        <r2-chip style="--border: red solid 1px; --bg: #333;"></r2-chip>
        <r2-chip
          style="--border: blue solid 1px; --bg: #333; --top: 3em"
        ></r2-chip>
      </div>
    `;
  }
}
