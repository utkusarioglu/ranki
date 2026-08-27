import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { ReconciliationUtils } from "_controllers/reconciler/utils.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { loadIcon } from "iconify-icon";
import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

import type { R2IconProps } from "./icon.mjs";

import style from "./icon-span.css?inline";
import { SVG_PLACEHOLDER } from "./SVG_PLACEHOLDER.mjs";

@customElement("r2-icon-span")
export class R2IconSpan extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    collection: getAnimationCollection,
    on: (s, type) => {
      if (type === "lifecycle.leave/end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
    role: "icon-span",
  })
  private readonly geo!: GeometryController<R2IconSpan>;

  @property()
  private accessor props!: R2IconProps;

  @state()
  private accessor svg: string = SVG_PLACEHOLDER;

  override async firstUpdated() {
    await this.geo.wait.layout();
    this.geo.events.emit({
      lifecycle: "update",
      style: {
        height: this.props.height,
        width: this.props.width,
      },
      type: "lifecycle",
    });
    try {
      const icon = await loadIcon(this.props.icon);
      this.svg = icon.body;
    } catch (e) {
      console.log(e);
    }
  }

  public override leave() {
    this.geo.events.emit({ lifecycle: "leave", type: "lifecycle" });
  }

  override render() {
    const { color, height, width } = this.props;
    return html`
      ${unsafeHTML(
        `<svg width="${width}" height="${height}" color="${color}">${this.svg}</svg> `,
      )}
    `;
  }
}
