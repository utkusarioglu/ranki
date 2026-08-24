import { R2C } from "_components/r2c/r2c.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { R2IconProps } from "./icon.mjs";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { loadIcon } from "iconify-icon";
import style from "./icon-span.css?inline";
import { SVG_PLACEHOLDER } from "./SVG_PLACEHOLDER.mjs";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";

@customElement("r2-icon-span")
export class R2IconSpan extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  private accessor props!: R2IconProps;

  @state()
  private accessor svg: string = SVG_PLACEHOLDER;

  @geometry<R2IconSpan>({
    role: "icon-span",
    collection: getAnimationCollection,
    on: (s, type) => {
      if (type === "lifecycle.leave/end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
  })
  private readonly geo!: GeometryController<R2IconSpan>;

  public override leave() {
    this.geo.events.emit({ type: "lifecycle", lifecycle: "leave" });
  }

  override async firstUpdated() {
    await this.geo.wait.layout();
    this.geo.events.emit({
      type: "lifecycle",
      lifecycle: "update",
      style: {
        width: this.props.width,
        height: this.props.height,
      },
    });
    try {
      const icon = await loadIcon(this.props.icon);
      this.svg = icon.body;
    } catch (e) {
      console.log(e);
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
