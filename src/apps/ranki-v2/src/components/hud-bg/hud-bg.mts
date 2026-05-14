import { R2C } from "_components/r2c/r2c.mjs";
import { css, type PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static styles = css`
    :host {
      position: absolute;
      display: block;
      background: var(--bg, gray);
      border: var(--border, 0);
      z-index: var(--z-index);
      width: 0;
      height: 0;
      opacity: 0;
      border-radius: var(--border-radius, 0);
      box-sizing: border-box;
    }
  `;

  protected firstUpdated(changed: PropertyValues): void {
    super.firstUpdated(changed);
    this.animateStyle(
      {
        opacity: 1,
      },
      {
        duration: 1000,
      },
    );
  }

  render() {
    return;
  }
}
