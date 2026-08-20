import type { RankiPropAnimationBlock } from "_config/config.types.mjs";
import { LitElement, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("r2-indicator-pattern")
export class R2IndicatorPattern extends LitElement {
  static override styles = css`
    :host {
      display: block;
      position: absolute;
      inset: 0;
      opacity: 0;
      transition-property: background;
      transition-duration: 1s;
      background: var(--pattern);
    }
  `;

  @property()
  private accessor pattern!: string;
  @property({ hasChanged: () => false })
  private accessor animation!: RankiPropAnimationBlock;

  protected override firstUpdated(): void {
    this.animate(
      {
        opacity: 1,
      },
      {
        duration: this.animation.duration,
        fill: "both",
      },
    );
  }

  override remove(): void {
    this.animate(
      {
        opacity: 0,
      },
      { duration: this.animation.duration },
    ).finished.then(() => super.remove());
  }

  override render() {
    console.log("re", this.pattern);
    this.style.setProperty("--pattern", this.pattern);
  }
}
