import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import { type AnimationTypes } from "_components/animation/animation.mts";
import { RankiAnimation } from "_components/animation/animation.mts";

export class HudAddressCrumb extends RankiHudWc<{}> {
  protected static name = "hud-address-crumb" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };
}
