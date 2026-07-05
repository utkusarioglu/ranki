import { R2C } from "_components/r2c/r2c.mjs";
import { unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./hud-bg.css?inline";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static override styles = unsafeCSS(style);

  @geometry<R2HudBg>({ role: "hud-bg" })
  private readonly geo!: GeometryController<R2HudBg>;

  override informStyle = this.geo.informStyle.bind(this.geo);

  override render() {
    return;
  }
}
