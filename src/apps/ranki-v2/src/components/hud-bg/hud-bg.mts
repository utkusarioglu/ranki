import { R2C } from "_components/r2c/r2c.mjs";
import { unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./hud-bg.css?inline";
import { GeometryController } from "_controllers/geometry/geometry.controller.mjs";
import { geometry } from "_controllers/geometry/geometry.decorator.mjs";
@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static override styles = unsafeCSS(style);

  @geometry<R2HudBg>({ role: "hud-bg" })
  // @ts-expect-error
  private readonly geo!: GeometryController<R2HudBg>;

  override render() {
    return;
  }
}
