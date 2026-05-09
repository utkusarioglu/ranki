import type { Dims, Pos } from "_components/r2c/r2c.mjs";
import { css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("r2-hud-bg")
export class R2HudBg extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      display: block;
      background: var(--bg, gray);
      z-index: var(--z-index);
      width: 0;
      height: 0;
      border-radius: 1em;
    }
  `;

  setPosition(pos: Pos) {
    this.animate(
      {
        translate: `${pos.left}px ${pos.top}px`,
      },
      {
        duration: 1e3,
        fill: "both",
      },
    );
  }

  setDims(dims: Dims) {
    this.animate(
      {
        width: dims.width + "px",
        height: dims.height + "px",
      },
      {
        duration: 1e3,
        fill: "both",
      },
    );
  }

  render() {
    return;
  }
}
