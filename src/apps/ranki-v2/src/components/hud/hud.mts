import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: 1em;
      white-space: nowrap;
    }
  `;

  @query("r2-cue-list")
  private cueList!: R2C;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions([this.cueList], (dims) => {
      const { width, height } = SizingUtils.column(dims);

      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public animateStyle(pos: AnimateableStyles): void {
    super.animateStyle(pos, { duration: 1000 });
    [this.cueList].forEach((e) =>
      e.informStyle({
        left: pos.left! + 20,
      }),
    );
  }

  render() {
    return html`<div>
      hud
      <r2-cue-list></r2-cue-list>
    </div>`;
  }
}
