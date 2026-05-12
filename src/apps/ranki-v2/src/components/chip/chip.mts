import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type AnimateableStyles,
  type Dims,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

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
  // private chdim!: Dims[];

  @property()
  private t: string = "";

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.registerSizeWatch();
  }

  private registerSizeWatch() {
    this.watchDims(
      () => [this.icon, this.text],
      () => {
        const { width, height, lefts, tops } = SizingUtils.row(this, {
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
        const container: Dims = { height, width };

        this.setStyle({ height: container.height });
        this.getDimWatched().forEach((e, i) =>
          e.animateStyle({ left: lefts[i], top: tops[i] }, { duration: 1000 }),
        );
        this.bg
          .setStyle({ height: container.height })
          .animateStyle({ width }, { duration: 1e3 });

        setTimeout(() => {
          this.emitChildLoad(container, {});
        }, PROPAGATE_DELAY);
      },
    );
  }

  public informStyle(pos: AnimateableStyles): void {
    this.animateStyle(pos, { duration: 1e3 });
    const dims = this.getDims();
    const watched = this.getDimWatched();
    watched.forEach((e, i) => e.informStyle(dims[i]));
  }

  render() {
    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon style="--position: absolute;"></r2-icon>
      <r2-text .t=${this.t} style="--position: absolute;"></r2-text>
    `;
  }
}
