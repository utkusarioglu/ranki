import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";

export class RankiFacesFace extends RankiFacesWc<{}> {
  public static name = "ranki-faces-face";
  protected animations: AnimationTypes = {
    enter: RankiAnimation.expandYFadeIn(this),
    exit: RankiAnimation.collapseYFadeOut(this),
  };
}
