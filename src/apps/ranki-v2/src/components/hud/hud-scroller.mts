import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type ComponentDims,
  type InformContext,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, html } from "lit";
import { customElement, query, queryAll } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-hud-scroller")
export class R2HudScroller extends R2C {
  static override styles = css`
    :host {
      display: block;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;

  @queryAll("r2-cue-list")
  private cueList!: NodeListOf<R2C>;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected override getSubtreeList(): R2C[] {
    return Array.from(this.cueList);
  }

  override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    return SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 10,
          end: 10,
        },
        cross: {
          start: 2,
          end: 2,
        },
      },
    );
  }

  protected override async updateStyle(
    { top, width, height, tops, lefts }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length }: InformContext,
  ): Promise<void> {
    const prevWidth = prev?.width || 0;
    const DELAY = 1000;
    const bodyDelay = width < prevWidth ? DELAY : 0;
    const subtreeDelay = width > prevWidth ? DELAY : 0;
    TimingUtils.delay(bodyDelay).then(() => {
      this.setStyle({ height, zIndex: length - index, top }).animateStyle(
        "size",
        {
          width,
        },
        {
          duration: 1e3,
        },
      );
      this.bg.informStyle({ left: 0, top: 0, width, height });
    });

    TimingUtils.delay(subtreeDelay).then(() => {
      this.informSubtreeStyles({ tops, lefts });
    });
  }

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -4,
          "--bg": "rgb(var(--scheme-yellow-2))",
        })}"
      ></r2-hud-bg>
      <r2-cue-list @r2-child-size=${this.onChildSize}></r2-cue-list>
    `;
  }
}
