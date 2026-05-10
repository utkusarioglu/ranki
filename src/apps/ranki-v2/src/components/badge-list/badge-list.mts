import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  SizingUtils,
  type AnimateableStyles,
} from "_components/r2c/r2c.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-badge-list")
export class R2BadgeList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @queryAll("r2-chip")
  private chips!: NodeListOf<R2C>;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitForDimensions(this.chips, (dims) => {
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
      this.chips.forEach((e, i) =>
        e.informStyle({ top: tops[i], left: lefts[i] }),
      );
      setTimeout(() => {
        this.emitChildLoad(container, {});
      }, PROPAGATE_DELAY);
    });
  }

  public informStyle(pos: AnimateableStyles): this {
    this.animateStyle(pos, { duration: 1000 });
    return this;
  }

  render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--border": "purple solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-chip style="--border: red solid 1px; --bg: #333;"></r2-chip>
      <r2-chip
        style="--border: blue solid 1px; --bg: #333; --top: 3em"
      ></r2-chip>
    `;
  }
}
