import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import type { R2TextProps } from "./text.mjs";

import style from "./text-span.css?inline";

@customElement("r2-text-span")
export class R2TextSpan extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  public accessor props!: R2TextProps;

  @geometry({
    collection: getAnimationCollection,
    on: (s, type) => {
      if (type === "lifecycle.leave/end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
    role: "text-span",
  })
  private readonly geo!: GeometryController<R2TextSpan>;

  @query("span")
  private accessor span!: HTMLSpanElement;

  override async firstUpdated() {
    await this.geo.wait.layout();
    const { height, width } = this.span.getBoundingClientRect();
    const style = { height: height + 1, width: width + 1 };
    this.geo.events.emit({ lifecycle: "update", style, type: "lifecycle" });
  }

  public override leave() {
    this.geo.events.emit({ lifecycle: "leave", type: "lifecycle" });
  }

  override render() {
    return html`<span style="color: ${this.props.color}"
      >${this.props.text}</span
    >`;
  }
}
