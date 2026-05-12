import { css, html } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import {
  R2C,
  type AnimateableStyles,
  type Dims,
} from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import { TimingUtils } from "_utils/timing.mjs";

export interface R2TextProps {
  animation: RankiPropAnimationBlock;
  text: string;
  color: string;
}

type R2TextInternalProps = R2TextProps & {
  runningAnimation?: Animation;
};

@customElement("r2-text")
export class R2Text extends R2C {
  static styles = css`
    :host {
      position: var(--position);
      white-space: nowrap;
      width: 0;
      overflow: hidden;
    }
  `;
  @property()
  private props!: R2TextProps;

  @queryAll("span")
  private spans!: NodeListOf<HTMLSpanElement>;

  private internal: R2TextInternalProps[] = [];

  public informStyle(pos: AnimateableStyles): void {
    this.setStyle({ height: pos.height }).animateStyle(
      { width: pos.width },
      { duration: 1000 },
    );
  }

  async updated() {
    await TimingUtils.waitLayout();
    const span = this.spans[this.spans.length - 1];
    if (!span) return;
    const rect = span.getBoundingClientRect();
    const dims: Dims = { width: rect.width, height: rect.height };
    this.emitChildLoad(dims, {});

    for (let i = 0; i < this.spans.length; i++) {
      const p = this.internal[i];
      const s = this.spans[i];
      if (!p.runningAnimation?.finished) {
        p.runningAnimation?.cancel();
      }
      if (i === this.spans.length - 1) {
        p.runningAnimation = s.animate(
          {
            opacity: 1,
          },
          {
            duration: p.animation.duration,
            easing: "linear",
            fill: "both",
          },
        );
      } else {
        p.runningAnimation = s.animate(
          {
            opacity: 0,
          },
          {
            duration: p.animation.duration,
            easing: "linear",
            fill: "both",
          },
        );
        p.runningAnimation.finished.then(() => s.remove());
      }
    }
  }

  private updateInternal() {
    const curr = this.internal.at(-1);
    if (!curr || this.props.text !== curr.text) {
      this.internal.push({
        text: this.props.text,
        color: this.props.color,
        animation: {
          preset: "default",
          enabled: true,
          duration: 1000,
        },
      });
    }
  }

  render() {
    this.updateInternal();

    return html`${this.internal.map(
      ({ text }) =>
        html`<span style="opacity: 0; position: absolute;">${text}</span>`,
    )}`;
  }
}
