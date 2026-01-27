import { RankiAnimation } from "../../../animation/animation.mts";
import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";

export class HudTagsTag extends RankiHudWc<{}> {
  protected static name = "hud-tags-tag" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };
}
