import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import type { R2HudBg } from "_components/hud-bg/hud-bg.mjs";
import type { R2Icon } from "_components/icon/icon.mjs";
import { R2C, type Dims, type Pos } from "_components/r2c/r2c.mjs";
import type { R2Text } from "_components/text/text.mjs";
import { css, html, type PropertyValues } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("r2-chip")
export class R2Chip extends R2C {
  static styles = css`
    :host {
      position: absolute;
      top: var(--top, 1em);
      white-space: nowrap;
      width: max-content;
      display: flex;
      align-items: center;
    }
  `;
  @query("r2-icon")
  private icon!: R2C;
  @query("r2-text")
  private text!: R2C;
  @query("r2-hud-bg")
  private bg!: R2HudBg;
  // private items = new WeakMap<R2C, Dims>();

  // connectedCallback(): void {
  //   super.connectedCallback();
  // }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    this.waitChildrenDims([this.icon, this.text], (dims) => {
      console.log("dims", dims);

      const width = dims.reduce((a, c) => c.width + a, 0);
      const height = dims.reduce((a, c) => Math.max(a, c.height), 0);

      this.bg.setDims({ width: width + 20, height });

      setTimeout(() => {
        this.emitChildLoad({ width, height }, {});
      }, PROPAGATE_DELAY);
    });
  }

  // setPosition(n: number) {
  //   super.setPosition(n);
  //   this.bg.setPosition(n);
  // }

  public setPosition(pos: Pos): void {
    super.setPosition(pos);
    // @ts-expect-error
    this.setChildrenPosition([this.bg], {
      top: 0,
      left: -10,
    });
  }

  render() {
    return html`
      <r2-hud-bg style="--z-index: -1;"></r2-hud-bg>
      <r2-icon></r2-icon>
      <r2-text></r2-text>
    `;
  }
}
