import { R2C } from "_components/r2c/r2c.mjs";
import { SizingUtils } from "_utils/sizing.utils.mjs";
import { html, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";
import styles from "./hud.css?inline";
import {
  geometry,
  type GeometryController,
} from "_controllers/geometry/geometry.mjs";

@customElement("r2-hud")
export class R2Hud extends R2C {
  static override styles = unsafeCSS(styles);

  @query("r2-hud-scroller")
  // @ts-expect-error
  private scroller!: R2C;

  @geometry({
    role: "hud",
    targets: {
      scroller: {
        isRoot: true,
        selector: (s) => [s.scroller],
        sizing: SizingUtils.row({
          cross: {
            start: 10,
            end: 5,
          },
        }),
      },
    },
  })
  private readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

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
