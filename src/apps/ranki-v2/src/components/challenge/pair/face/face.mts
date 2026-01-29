import {
  RankiAnimation,
  type AnimationTypes,
} from "../../../animation/animation.mts";
import { RankiFacesWc } from "../../faces-wc/faces-wc.mts";

export class RankiFacesFace extends RankiFacesWc<{}> {
  public static name = "ranki-faces-face";
  protected animations: AnimationTypes = {
    enter: RankiAnimation.expandYFadeIn(this),
    exit: RankiAnimation.collapseYFadeOut(this),
  };
}
