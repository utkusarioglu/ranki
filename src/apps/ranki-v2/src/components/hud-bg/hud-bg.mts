import { R2C, type InformStyle } from "_components/r2c/r2c.mjs";
import { css } from "lit";
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
      border-radius: 0.5em;
      box-sizing: border-box;
    }
  `;

  public informStyle(pos: InformStyle): void {
    this.setStyle({ height: pos.height }).animateStyle(
      "opacity",
      {
        opacity: 1,
        width: pos.width,
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
