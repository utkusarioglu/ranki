import { StoreController } from "_/controllers/store.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import { R2C, type AnimateableStyles } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
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

  private state = new StoreController(
    this,
    (s) => s.state?.hud.subtree.tags.list,
  );

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.watchDims(
      () => this.chips,
      () => {
        const { width, height, tops, lefts } = SizingUtils.row(this, {
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
      },
    );
  }

  public informStyle(pos: AnimateableStyles): this {
    this.animateStyle(pos, { duration: 1000 });
    return this;
  }

  render() {
    const list = this.state.value || [];
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -2,
          "--border": "purple solid 1px",
        })}"
      ></r2-hud-bg>
      ${repeat(
        Array(list.length)
          .fill(null)
          .map((_, i) => i),
        (i) => i,
        (i) => {
          return html`
            <r2-chip
              .index=${i}
              .list=${this.state.value}
              style="--border: red solid 1px; --bg: #333;"
            ></r2-chip>
          `;
        },
      )}
    `;
  }
}

// <r2-chip style="--border: red solid 1px; --bg: #333;"></r2-chip>
// <r2-chip
//   style="--border: blue solid 1px; --bg: #333; --top: 3em"
// ></r2-chip>
