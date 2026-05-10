import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;

  @query("r2-cue-list")
  private cueList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions([this.cueList], (dims) => {
      const { width, height, tops, lefts } = SizingUtils.row(dims, {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
      });
      const container = { width, height };
      this.bg
        .setStyle({ height: container.height })
        .animateStyle({ width: container.width }, { duration: 1000 });
      [this.cueList].forEach((e, i) =>
        e.informStyle({ top: tops[i], left: lefts[i] }),
      );
      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  public informStyle(pos: AnimateableStyles): void {
    this.animateStyle(pos, { duration: 1000 });
  }

  render() {
    return html`<div>
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--border": "green solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-cue-list></r2-cue-list>
    </div>`;
  }
}
