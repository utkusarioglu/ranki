import { R2C, type Dims } from "_components/r2c/r2c.mjs";
import { TimingUtils } from "_utils/timing.mjs";
import { css, type PropertyValues, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { R2TextProps } from "./text.mts";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";

@customElement("r2-text-span")
export class R2TextSpan extends R2C {
  static styles = css`
    :host {
      position: absolute;
      white-space: nowrap;
      opacity: 0;
      width: 0;
      height: 0;
      overflow: hidden;
    }
  `;
  @property()
  public props!: R2TextProps;

  @query("span")
  private span!: HTMLSpanElement;

  @property({ type: Boolean, reflect: true })
  leave = false;

  private animation!: Animation;

  updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
      this.animation?.cancel();
      this.animateLeave();
    }
  }

  async animateLeave() {
    this.animateStyle(
      {
        opacity: 0,
      },
      {
        duration: this.props.animation.duration,
      },
      () => {
        this.dispatchEvent(
          new CustomEvent("r2-text-span-left", {
            bubbles: true,
            composed: true,
          }),
        );
      },
      this.animation,
    );
  }

  async firstUpdated(_changedProperties: PropertyValues) {
    await TimingUtils.waitLayout();
    const { width, height } = this.span.getBoundingClientRect();
    const dims: Dims = { width, height };
    this.setStyle({ height }).animateStyle(
      {
        width,
        opacity: 1,
      },
      {
        duration: this.props.animation.duration,
      },
    );
    setTimeout(() => {
      this.emitChildLoad(dims, {});
    }, PROPAGATE_DELAY);
  }

  render() {
    return html`<span style="color: ${this.props.color}"
      >${this.props.text}</span
    >`;
  }
}
