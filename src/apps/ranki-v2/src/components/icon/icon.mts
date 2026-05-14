import { css, html } from "lit";
import { customElement, property, queryAll } from "lit/decorators.js";
import { loadIcon } from "iconify-icon";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import {
  R2C,
  type AnimateableStyles,
  type Dims,
} from "_components/r2c/r2c.mjs";
import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import { TimingUtils } from "_utils/timing.mjs";

export interface R2IconProps {
  animation: RankiPropAnimationBlock;
  icon: string;
  color: string;
  width: number;
  height: number;
}

type R2IconInternalProps = R2IconProps & {
  runningAnimation?: Animation;
  svg: string;
};

const SVG_PLACEHOLDER = `
  <circle
    cx="12"
    cy="12"
    r="12"
    fill="var(rgb(--scheme-text-2))"
  />
`.trim();

@customElement("r2-icon")
export class R2Icon extends R2C {
  static styles = css`
    :host {
      white-space: nowrap;
      width: 0;
      overflow: hidden;
    }
  `;

  @property()
  private props!: R2IconProps;

  @queryAll("svg")
  private subtree!: NodeListOf<SVGSVGElement>;

  private internal: R2IconInternalProps[] = [];

  public informStyle({ height, width }: AnimateableStyles): void {
    this.setStyle({ height });
    this.animateStyle({ width: width }, { duration: 1000 });
  }

  private updateInternal() {
    const curr = this.internal.at(-1);
    if (curr && this.props.icon === curr.icon) return;
    this.internal.push({
      ...this.props,
      svg: SVG_PLACEHOLDER,
    });
  }

  async updated() {
    await TimingUtils.waitLayout();
    for (let i = 0; i < this.internal.length; i++) {
      const p = this.internal[i];
      const s = this.subtree[i];
      if (!p.runningAnimation?.finished) {
        p.runningAnimation?.cancel();
      }
      if (i === this.subtree.length - 1) {
        const height = 24;
        const icon = loadIcon(p.icon);
        icon
          .then((icon) => {
            const dims: Dims = { width: height, height };
            p.svg = icon.body;
            s.innerHTML = icon.body;
            this.emitChildLoad(dims, {});
          })
          .then(() => {
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
          });
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

  render() {
    this.updateInternal();

    return html`${this.internal.map(
      ({ svg, width, height, color }) =>
        html`<svg width="${width}" height="${height}" color="${color}">
          ${unsafeHTML(svg)}
        </svg>`,
    )}`;
  }
}
