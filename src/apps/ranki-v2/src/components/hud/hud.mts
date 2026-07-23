import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/sizing.utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import styles from "./hud.css?inline";
import { type GeometryController } from "_controllers/geometry/controller/geometry.controller.mjs";
import { geometry } from "_controllers/geometry/decorator/geometry.decorator.mjs";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static override styles = unsafeCSS(styles);

  @query("r2-hud-scroller")
  private scroller!: R2C;

  @geometry<R2Hud>({
    role: "hud",
    targets: {
      scroller: {
        isRoot: true,
        selector: (s) => [s.scroller],
        sizing: () =>
          SizingUtils.row({
            cross: {
              start: 10,
              end: 5,
            },
          }),
      },
    },
  })
  private readonly geo!: GeometryController<R2Hud>;

  override render() {
    return html`
      <div class="rotate">
        <div class="content">
          <r2-hud-scroller
            @r2-geometry=${this.geo.onEmit("scroller")}
          ></r2-hud-scroller>
        </div>
      </div>
    `;
  }
}
