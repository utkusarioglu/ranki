import { R2C } from "_components/r2c/r2c.mjs";
import { type Dims } from "_/controllers/geometry.types.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, type PropertyValues, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { R2TextProps } from "./text.mts";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";

@customElement("r2-text-span")
export class R2TextSpan extends R2C {
  static override styles = css`
    :host {
      position: absolute;
      opacity: 0;
    }

    :host > span {
      white-space: nowrap;
    }
  `;
  @property()
  public props!: R2TextProps;

  @query("span")
  private span!: HTMLSpanElement;

  @property({ type: Boolean, reflect: true })
  leave = false;

  private animation!: Animation;

  override updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
      this.animation?.cancel();
      this.animateLeave();
    }
  }

  async animateLeave() {
    this.animateStyle(
      {
        name: "opacity",
        keyframes: {
          opacity: 0,
        },
        options: {
          duration: this.props.animation.duration,
        },
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

  override async firstUpdated(changed: PropertyValues) {
    super.firstUpdated(changed);
    await TimingUtils.waitLayout();
    const { width, height } = this.span.getBoundingClientRect();
    const dims: Dims = { width: width + 1, height: height + 1 };
    this.setStyle(dims).animateStyle({
      name: "opacity",
      keyframes: {
        // width,
        opacity: 1,
      },
      options: {
        duration: this.props.animation.duration,
        // delay: 500,
      },
    });
    setTimeout(() => {
      this.emitSize(dims);
    }, PROPAGATE_DELAY);
  }

  override render() {
    return html`<span style="color: ${this.props.color}"
      >${this.props.text}</span
    >`;
  }
}
