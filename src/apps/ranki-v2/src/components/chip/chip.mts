import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: var(--top, 1em);
      white-space: nowrap;
      width: max-content;
      display: flex;
      align-items: center;
    }
  `;
  @query("r2-icon")
  private icon!: R2C;
  @query("r2-text")
  private text!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions([this.icon, this.text], (dims) => {
      const { width, height } = SizingUtils.row(dims);
      const containerHeight = height + 10;

      this.setStyle({ height: containerHeight });
      this.bg.setStyle({ height: containerHeight });
      this.bg.animateStyle(
        { width: width + 20, height: containerHeight },
        { duration: 1e3 },
      );

      setTimeout(() => {
        this.emitChildLoad({ width, height: containerHeight }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public animateStyle(pos: AnimateableStyles): void {
    super.animateStyle(pos, { duration: 1000 });
    this.bg.informStyle({ left: -10 });
  }

  render() {
    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon></r2-icon>
      <r2-text></r2-text>
    `;
  }
}
