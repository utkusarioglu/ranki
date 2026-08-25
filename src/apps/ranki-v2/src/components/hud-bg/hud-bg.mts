import { R2C } from "_components/r2c/r2c.mjs";
import {
  geometry,
  GeometryController,
} from "_controllers/geometry/geometry.mjs";
import { getAnimationCollection } from "_store/app/app.getters.mjs";
import { unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import style from "./hud-bg.css?inline";

/**
 * @dev
 * #1 Has to be defined
 */
@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static override styles = unsafeCSS(style);

  @geometry<R2HudBg>({
    collection: getAnimationCollection,
    events: {
      hover: false,
    },
    role: "hud-bg",
  })
  // @ts-expect-error #1
  private readonly geo!: GeometryController<R2HudBg>;

  override render() {
    return;
  }
}
