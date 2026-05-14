import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  R2CNew,
  type AnimateableStyles,
  type ComponentDims,
  type Dims,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2CNew;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected getSizeList(): R2CNew[] {
    return [this.badgeList];
  }

  updateGeometry(dims: ComponentDims[]): Dims | null {
    const { width, height, tops, lefts } = SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
      },
    );
    const container = { width, height };
    this.bg
      .setStyle({ height: container.height })
      .animateStyle({ width: container.width }, { duration: 1000 });
    this.getSizeList().forEach((e, i) =>
      e.informStyle({ top: tops[i], left: lefts[i] }),
    );
    // setTimeout(() => {
    //   this.emitChildLoad(container, {});
    // }, PROPAGATE_DELAY);
    return container;
  }

  // protected firstUpdated(_changedProperties: PropertyValues): void {
  //   this.watchDims(
  //     () => [this.badgeList],
  //     () => {
  //       const { width, height, tops, lefts } = SizingUtils.rowOld(this, {
  //         main: {
  //           start: 10,
  //           inBetween: 10,
  //           end: 10,
  //         },
  //       });
  //       const container = { width, height };
  //       this.bg
  //         .setStyle({ height: container.height })
  //         .animateStyle({ width: container.width }, { duration: 1000 });
  //       this.getDimWatched().forEach((e, i) =>
  //         e.informStyle({ top: tops[i], left: lefts[i] }),
  //       );
  //       setTimeout(() => {
  //         this.emitChildLoad(container, {});
  //       }, PROPAGATE_DELAY);
  //     },
  //   );
  // }

  public informStyle(pos: AnimateableStyles): this {
    this.animateStyle(pos, { duration: 1000 });
    return this;
  }

  render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -3,
          "--border": "pink solid 1px",
        })}"
      ></r2-hud-bg>
      <r2-badge-list @r2-child-size=${this.onChildSize}></r2-badge-list>
    `;
  }
}
