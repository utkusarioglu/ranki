import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import {
  R2C,
  type ComponentDims,
  type InformContext,
  type R2Sizing,
  type UpdateStyle,
} from "_components/r2c/r2c.mjs";
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
    const sizing = SizingUtils.row(
      dims.map((v) => v.dims),
      {
        main: {
          start: 10,
          inBetween: 5,
          end: 10,
        },
        cross: {
          start: 5,
          end: 5,
        },
      },
    );
    return sizing;
  }

  protected override async updateStyle(
    { top, left, width, height, lefts, tops }: UpdateStyle,
    prev: UpdateStyle | null,
    { index, length, changes: { mutateIndex, mutateOrder } }: InformContext,
  ): Promise<void> {
    // const delayIndex = mutateIndex > index ? 0 : index - mutateIndex;
    const delayIndex = mutateOrder[index];
    const bodyDelay = 1000 * delayIndex;
    const subtreeDelay = bodyDelay;
    await Promise.all([
      TimingUtils.delay(bodyDelay).then(() => {
        this.setStyle({ top, left, width, height, zIndex: length - index });
        this.bg.informStyle({ width, height, top: 0, left: 0 });
      }),

      TimingUtils.delay(subtreeDelay).then(() =>
        this.informSubtreeStyles({ tops, lefts }),
      ),
    ]);
  }

  override updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
      this.animateLeave();
    }
  }

  async animateLeave() {
    const height = this.getSizing().height;
    this.emitSize({ height, width: 0 });
    this.bg.informStyle({ width: 0, height, top: 0, left: 0 });
    this.animateStyle(
      "opacity",
      {
        opacity: 0,
        width: 0,
      },
      {
        // TODO
        duration: 1000,
        // duration: this.list[this.index].animation.duration,
      },
      () => {
        this.dispatchEvent(
          new CustomEvent("r2-child-leave", {
            bubbles: true,
            composed: true,
          }),
        );
      },
    );
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
