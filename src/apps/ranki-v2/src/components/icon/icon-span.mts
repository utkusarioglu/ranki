import { R2C } from "_components/r2c/r2c.mjs";
import { type Dims } from "_/controllers/geometry/geometry.types.mjs";
import { type PropertyValues, html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { R2IconProps } from "./icon.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { loadIcon } from "iconify-icon";
import { TimingUtils } from "_utils/timing,utils.mjs";
import {
  geometry,
  GeometryController,
} from "_/controllers/geometry/geometry.mjs";
import style from "./icon-span.css?inline";
import { SVG_PLACEHOLDER } from "./SVG_PLACEHOLDER.mjs";

@customElement("r2-icon-span")
export class R2IconSpan extends R2C {
  static override styles = unsafeCSS(style);
  @property()
  public props!: R2IconProps;

  @state()
  private svg: string = SVG_PLACEHOLDER;

  @property({ type: Boolean, reflect: true })
  leave = false;

  @geometry({ role: "icon-span" })
  public readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

  override updated(changed: PropertyValues) {
    if (!changed.has("leave")) return;
    if (this.leave) {
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

  override async firstUpdated() {
    const { width, height } = this.props;
    const dims: Dims = { width, height };
    await TimingUtils.waitLayout();
    this.geo.emitSize(dims);
    try {
      const icon = await loadIcon(this.props.icon);
      this.svg = icon.body;
    } catch (e) {
      console.log(e);
    } finally {
      setTimeout(() => {
        this.geo.emitSize(dims);
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
