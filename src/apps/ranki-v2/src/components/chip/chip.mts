import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
  type Dims,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static styles = css`
    :host {
      position: absolute;
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
      const { width, height, lefts, tops } = SizingUtils.row(dims, {
        main: {
          start: 10,
          inBetween: 5,
          end: 10,
        },
        cross: {
          start: 5,
          end: 5,
        },
      });
      const container: Dims = {
        height,
        width,
      };

      this.setStyle({ height: container.height });
      [this.icon, this.text].forEach((e, i) =>
        e.animateStyle({ left: lefts[i], top: tops[i] }, { duration: 1000 }),
      );
      this.bg
        .setStyle({ height: container.height })
        .animateStyle({ width }, { duration: 1e3 });

      setTimeout(() => {
        this.emitChildLoad(container, {});
      }, PROPAGATE_DELAY);
    });
  }

  public informStyle(pos: AnimateableStyles): void {
    this.animateStyle(pos, { duration: 1e3 });
  }

  render() {
    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon style="--position: absolute;"></r2-icon>
      <r2-text style="--position: absolute;"></r2-text>
    `;
  }
}
