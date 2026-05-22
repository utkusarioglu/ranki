import { R2C } from "_components/r2c/r2c.mjs";
import { unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";
import style from "./hud-bg.css?inline";
import { geometry, GeometryController } from "_/controllers/geometry.mjs";
@customElement("r2-hud-bg")
export class R2HudBg extends R2C {
  static override styles = unsafeCSS(style);

  @geometry({
    role: "hud-bg",
    targets: {
      root: { selector: (e) => [e.shadowRoot] },
    },
  })
  public readonly geo!: GeometryController;

  override informStyle = this.geo.informStyle.bind(this.geo);

  // OBSOLETE
  // protected override getSizing(): R2Sizing {
  //   // @ts-expect-error
  //   return {};
  // }

  // protected override async updateStyle({
  //   width,
  //   height,
  // }: UpdateStyle): Promise<void> {
  //   this.setStyle({ height }).animateStyle({
  //     name: "opacity",
  //     keyframes: {
  //       opacity: 1,
  //       width,
  //     },
  //     options: {
  //       duration: 1000,
  //     },
  //   });
  // }

  override render() {
    return;
  }
}
