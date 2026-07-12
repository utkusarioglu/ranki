import { R2C } from "_components/r2c/r2c.mjs";
import { type Dims } from "_controllers/geometry/geometry.types.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { R2IconProps } from "./icon.mjs";
import { PROPAGATE_DELAY } from "_/debug.constants.mjs";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { loadIcon } from "iconify-icon";
import { TimingUtils } from "_utils/timing,utils.mjs";
import { GeometryController } from "_controllers/geometry/geometry.mjs";
import { geometry } from "_controllers/geometry/geometry.decorator.mjs";
import style from "./icon-span.css?inline";
import { SVG_PLACEHOLDER } from "./SVG_PLACEHOLDER.mjs";
import { ReconciliationUtils } from "_utils/reconciliation.utils.mjs";

@customElement("r2-icon-span")
export class R2IconSpan extends R2C {
  static override styles = unsafeCSS(style);

  @property()
  private props!: R2IconProps;

  @state()
  private svg: string = SVG_PLACEHOLDER;

  @geometry<R2IconSpan>({
    role: "icon-span",
    on: (s, type) => {
      if (type === "leave-end") {
        ReconciliationUtils.emitLeave(s);
      }
    },
  })
  private readonly geo!: GeometryController<R2IconSpan>;

  public override leave() {
    this.geo.emit("leave");
  }

  override async firstUpdated() {
    const { width, height } = this.props;
    const dims: Dims = { width, height };
    await TimingUtils.waitLayout();
    setTimeout(() => {
      this.geo.emit("update", dims);
    }, PROPAGATE_DELAY);
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
