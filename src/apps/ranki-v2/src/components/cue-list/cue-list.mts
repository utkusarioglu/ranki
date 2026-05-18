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
import { customElement, query } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("r2-cue-list")
export class R2CueList extends R2C {
  static override styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @query("r2-badge-list")
  private badgeList!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  protected override getSubtreeList(): R2C[] {
    return [this.badgeList];
  }

  protected override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    const sizing = SizingUtils.row(
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
    return sizing;
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
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length }: InformContext,
  ): Promise<void> {
    await Promise.all([
      TimingUtils.delay(0).then(() => {
        this.setStyle({ zIndex: length - index }).animateStyle(
          "position",
          { top, left },
          { duration: 1e3 },
        );
        this.bg.informStyle({ top, left, width, height });
      }),
      TimingUtils.delay(1000).then(() =>
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
          await this.bg.informStyle({ width, height, top: 0, left: 0 });
        }),
      );
  }

  override render() {
    return html`
      <r2-hud-bg
        style="${styleMap({
          "--z-index": -3,
          "--bg": "rgb(var(--scheme-blue-2))",
        })}"
      ></r2-hud-bg>
      <r2-badge-list @r2-child-size=${this.onChildSize}></r2-badge-list>
    `;
  }
}
