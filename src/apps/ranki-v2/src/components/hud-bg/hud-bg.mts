import { R2C } from "_components/r2c/r2c.mjs";
import { type UpdateStyle } from "_/controllers/geometry.types.mjs";
import { type R2Sizing } from "_/controllers/geometry.types.mjs";
import { css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static override styles = css`
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
      transition-property: background, border;
      transition-duration: 1s;
    }
  `;

  protected override getSizing(): R2Sizing {
    // @ts-expect-error
    return {};
  }

  protected override async updateStyle({
    width,
    height,
  }: UpdateStyle): Promise<void> {
    this.setStyle({ height }).animateStyle({
      name: "opacity",
      pos: {
        opacity: 1,
        width,
      },
      options: {
        duration: 1000,
      },
    });
  }

  override render() {
    return;
  }
}
