import { HudShadowBase } from "../../hud-base.mts";

export class HudAddressCrumb extends HudShadowBase<{}> {
  private static name = "hud-address-crumb";

  connectedCallback() {
    this.setProperties({ opacity: 0 });
    this.twoRaf(() => {
      this.setProperties({ opacity: 1 });
    });
  }

  exit() {
    this.addEventListener("transitionend", () => this.remove(), {
      once: true,
    });
    this.setProperties({ opacity: 0 });
  }
}
