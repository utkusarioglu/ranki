import { RankiAnimation } from "../../../animation/animation.mts";
import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";

export class HudCuesCue extends RankiHudWc<{}> {
  protected static name = "hud-cues-cue" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };
}
