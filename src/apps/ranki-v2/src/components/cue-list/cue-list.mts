import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: 1em;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2C;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions([this.badgeList], (dims) => {
      const { width, height } = SizingUtils.column(dims);
      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public animateStyle(pos: AnimateableStyles): void {
    super.animateStyle(pos, { duration: 1000 });
    [this.badgeList].forEach((e) =>
      e.informStyle({
        left: pos.left! + 20,
      }),
    );
  }

  render() {
    return html`
      <div>
        cue-list
        <r2-badge-list></r2-badge-list>
      </div>
    `;
  }
}
