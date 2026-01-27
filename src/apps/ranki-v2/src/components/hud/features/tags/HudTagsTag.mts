import { HudShadowBase } from "../../hud-base.mts";

export class HudTagsTag extends HudShadowBase<{}> {
  private static name = "hud-tags-tag";

  connectedCallback() {
    this.animateEntry();
  }

  private animateEntry() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          r();
        },
        { once: true },
      );
      this.setProperties({ opacity: 0 });
      this.twoRaf(() => {
        this.setProperties({ opacity: 1 });
      });
    });
  }

  exit() {
    this.animateExit();
  }

  private animateExit() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          this.remove();
          r();
        },
        { once: true },
      );
      this.setProperties({ opacity: 1 });
      this.twoRaf(() => {
        this.setProperties({ opacity: 0 });
      });
    });
  }
}
