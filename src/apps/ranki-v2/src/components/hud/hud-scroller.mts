import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import {
  R2C,
  type AnimationPack,
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
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    const animationPack: AnimationPack = {
      expand: this.animateExpansion.bind(this),
      contract: this.animateContraction.bind(this),
      none: () => Promise.resolve(),
    };
    return animationPack[curr.main.action](curr, prev, context);
  }

  protected async animateExpansion(
    { top, width, height, tops, lefts }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length }: InformContext,
  ): Promise<void> {
    await Promise.all([
      TimingUtils.delay(0).then(() => {
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
      }),

      TimingUtils.delay(1000).then(() =>
        this.informSubtreeStyles({ tops, lefts }),
      ),
    ]);
  }

  private async animateContraction(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
  ): Promise<void> {
    await TimingUtils.delay(0)
      .then(() =>
        this.informSubtreeStyles(
          { tops, lefts },
          {
            add: [],
            remove: [],
            retain: [Number.NaN],
            update: [],
            mutateOrder: [],
            mutateIndex: Number.NaN,
          },
        ),
      )
      .then(() =>
        TimingUtils.delay(1000).then(async () => {
          this.animateStyle("position", { top, left }, { duration: 1e3 });
          this.animateStyle(
            "size",
            {
              width,
            },
            {
              duration: 1e3,
            },
          );
          await this.bg.informStyle({ width, height, top: 0, left: 0 });
        }),
      );
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
