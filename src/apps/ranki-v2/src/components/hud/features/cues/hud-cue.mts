import { HudShadowBase, type AnimationTypes } from "../../hud-base.mts";

export class HudCuesCue extends HudShadowBase<{}> {
  protected static name = "hud-cues-cue" as const;
  protected animations: AnimationTypes = {
    enter: this.animateEntry.bind(this),
    exit: this.animateExit.bind(this),
  };

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
