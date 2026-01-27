import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";
import { RankiAnimation } from "../../../animation/animation.mts";

export class HudAddressCrumb extends RankiHudWc<{}> {
  protected static name = "hud-address-crumb" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };
}
