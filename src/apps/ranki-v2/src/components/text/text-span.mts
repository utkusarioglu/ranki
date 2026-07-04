import { R2C } from "_components/r2c/r2c.mjs";
import { type Dims } from "_controllers/geometry/geometry.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { R2TextProps } from "./text.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import style from "./text-span.css?inline";

@customElement("r2-text-span")
export class R2TextSpan extends R2C {
  static override styles = unsafeCSS(style);
  @property()
  public props!: R2TextProps;

  @query("span")
  private span!: HTMLSpanElement;

  @geometry({
    role: "text-span",
    on: (s, action) => {
      if (action === "leave-end") {
        s.emitLeave();
      }
    },
  })
  public readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

  public override async leave(_stagger: number) {
    this.geo.emit("leave");
  }

  override async firstUpdated() {
    await TimingUtils.waitLayout();
    const { width, height } = this.span.getBoundingClientRect();
    const dims: Dims = { width: width + 1, height: height + 1 };
    setTimeout(() => {
      this.geo.emit("size", dims);
    }, PROPAGATE_DELAY);
  }

  override render() {
    return html`<span style="color: ${this.props.color}"
      >${this.props.text}</span
    >`;
  }
}
