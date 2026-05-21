import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import { R2C } from "_components/r2c/r2c.mjs";
import { type AnimationPack } from "_/controllers/TEMP_ANIMATION_DICT.mjs";
import { type InformContext } from "_/controllers/geometry.types.mjs";
import { type UpdateStyle } from "_/controllers/geometry.types.mjs";
import { type R2Sizing } from "_/controllers/geometry.types.mjs";
import { type ComponentDims } from "_/controllers/geometry.types.mjs";
import { SizingUtils } from "_utils/Sizing.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static override styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
    }
  `;
  @property({ type: Boolean, reflect: true })
  leave = false;
  @query("r2-icon")
  private icon!: R2C;
  @query("r2-text")
  private text!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;

  @property()
  private index!: number;
  @property()
  private list!: HudTagListItem[];

  protected override getSubtreeList(): R2C[] {
    return [this.icon, this.text];
  }

  override updateSizing(dims: ComponentDims[]): R2Sizing | null {
    return SizingUtils.row({
      main: {
        start: 10,
        gap: 5,
        end: 10,
      },
      cross: {
        start: 5,
        end: 5,
      },
    })(dims);
  }

  protected override async updateStyle(
    curr: UpdateStyle,
    prev: UpdateStyle | null,
    context: InformContext,
  ): Promise<void> {
    const animationPack: AnimationPack = {
      // FIX realize that enter and leave are not here
      expand: this.animateExpansion.bind(this),
      contract: this.animateContraction.bind(this),
      none: () => Promise.resolve(),
    };
    return animationPack[curr.main.action](curr, prev, context);
  }

  protected async animateExpansion(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length, diff: { mutateOrder } }: InformContext,
  ): Promise<void> {
    const delayIndex = mutateOrder[index];
    const bodyDelay = 1000 * delayIndex;
    await Promise.all([
      TimingUtils.delay(bodyDelay).then(() => {
        this.setStyle({ top, left, width, height, zIndex: length - index });
        this.bg.informStyle({ width, height, top: 0, left: 0 });
      }),

      TimingUtils.delay(bodyDelay + 1000).then(() =>
        this.informSubtreeStyles({ tops, lefts }),
      ),
    ]);
  }
  protected async animateContraction(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length, diff: { mutateOrder } }: InformContext,
  ): Promise<void> {
    const delayIndex = mutateOrder[index];
    const bodyDelay = 1000 * delayIndex;
    await TimingUtils.delay(bodyDelay);
    await this.informSubtreeStyles({ tops, lefts });
    await TimingUtils.delay(1000);
    this.setStyle({ top, left, width, height, zIndex: length - index });
    await this.bg.informStyle({ width, height, top: 0, left: 0 });
  }

  private async animateLeave() {
    const height = this.getSizing().height;
    this.bg.informStyle({ width: 0, height, top: 0, left: 0 });
    return new Promise<void>((resolve) => {
      this.animateStyle(
        {
          name: "opacity",
          keyframes: {
            opacity: 0,
            width: 0,
          },
          options: {
            // TODO
            duration: 1000,
            // duration: this.list[this.index].animation.duration,
          },
        },
        resolve,
      );
    });
  }

  override updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
      this.animateLeave().then(() => {
        this.emitLeave();
      });
    }
  }

  override render() {
    const item = this.list[this.index];

    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon
        .props=${{
          icon: "mdi:home",
          color: "rgb(var(--scheme-orange-2))",
          width: 24,
          height: 24,
          animation: {
            enabled: true,
            duration: 1000,
          },
        }}
        style="position: absolute;"
        @r2-child-size=${this.onChildSize}
      ></r2-icon>
      <r2-text
        .props=${item}
        style="position: absolute;"
        @r2-child-size=${this.onChildSize}
      ></r2-text>
    `;
  }
}
