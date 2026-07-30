import { R2C } from "_components/r2c/r2c.mjs";
import { type WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import type { R2TextProps } from "./text.mjs";
import { PROPAGATE_DELAY } from "_/debug/debug.constants.mjs";
import { GeometryController } from "_controllers/geometry/controller/geometry-controller.mjs";
import { geometry } from "_controllers/geometry/decorator/geometry-decorator.mjs";
import style from "./text-span.css?inline";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";

@customElement("r2-text-span")
export class R2TextSpan extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  public props!: R2TextProps;

  @query("span")
  private span!: HTMLSpanElement;

  @geometry<R2TextSpan>({
    role: "text-span",
    on: (s, type) => {
      if (type === "leave-end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
  })
  private readonly geo!: GeometryController<R2TextSpan>;

  public override leave() {
    this.geo.emit("leave");
  }

  override async firstUpdated() {
    await TimingUtils.waitLayout();
    const { width, height } = this.span.getBoundingClientRect();
    const dims: WidthHeight = { width: width + 1, height: height + 1 };
    setTimeout(() => {
      this.geo.emit("update", dims);
    }, PROPAGATE_DELAY);
  }

  override render() {
    return html`<span style="color: ${this.props.color}"
      >${this.props.text}</span
    >`;
  }
}
