import { R2C } from "_components/r2c/r2c.mjs";
import { type Dims } from "_/controllers/geometry.types.mjs";
import { css, type PropertyValues, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { R2IconProps } from "./icon.mts";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { loadIcon } from "iconify-icon";
import { TimingUtils } from "_utils/timing.mjs";

const SVG_PLACEHOLDER = `
  <circle
    cx="12"
    cy="12"
    r="12"
    fill=rgb(var(--scheme-surface-3))
  />
`.trim();

@customElement("r2-icon-span")
export class R2IconSpan extends R2C {
  static override styles = css`
    :host {
      position: absolute;
      overflow: hidden;
      opacity: 0;
      width: 0;
      height: 0;
    }
  `;
  @property()
  public props!: R2IconProps;

  @state()
  private svg: string = SVG_PLACEHOLDER;

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
    const { width, height } = this.props;
    const dims: Dims = { width, height };
    await TimingUtils.waitLayout();
    this.emitSize(dims);
    try {
      const icon = await loadIcon(this.props.icon);
      this.svg = icon.body;
    } catch (e) {
      console.log(e);
    } finally {
      this.setStyle({ height }).animateStyle({
        name: "width",
        keyframes: {
          width,
          opacity: 1,
        },
        options: {
          duration: this.props.animation.duration,
        },
      });
      setTimeout(() => {
        this.emitSize(dims);
      }, PROPAGATE_DELAY);
    }
  }

  override render() {
    const { width, height, color } = this.props;
    return html`
      ${unsafeHTML(
        `<svg width="${width}" height="${height}" color="${color}">${this.svg}</svg> `,
      )}
    `;
  }
}
