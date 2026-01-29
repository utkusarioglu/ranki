import { RankiAnimation } from "../../../animation/animation.mts";
import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";
import type { CueRecord } from "../../../../config/config.types.mts";

type CueProps = {
  record: CueRecord;
  index: number;
};

export class HudCuesCue extends RankiHudWc<CueProps> {
  protected static name = "hud-cues-cue" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };

  render(): this {
    this.mutate();
    return this;
  }

  setMutations(c: CueRecord) {
    this.setProps({ record: c, index: this.getCurr().index });
  }

  mutate() {
    const curr = this.getCurr();
    const c = curr.record;
    if (c.bgColor) {
      this.style.background = `rgb(var(--scheme-${c.bgColor}))`;
    } else {
      this.style.removeProperty("background");
    }
    if (c.textColor) {
      this.style.color = `rgb(var(--scheme-${c.textColor}))`;
    } else {
      this.style.removeProperty("color");
    }
    this.innerText = c.message || c.indicator || "";
    this.addClass("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    this.setAttribute("data-index", curr.index.toString());
  }
}
