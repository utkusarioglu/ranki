import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { assertNotUndefined } from "_error/assertions.mjs";

export class RankiFacesFace extends RankiFacesWc<{}> {
  public static name = "ranki-faces-face";
  protected animations: AnimationTypes = {
    enter: RankiAnimation.expandYFadeIn(this),
    exit: RankiAnimation.collapseYFadeOut(this),
  };

  getKey() {
    return this.getAttribute("dqm-source");
  }

  setKey(key: string) {
    this.setAttribute("dqm-source", key);
  }

  checkKey(f: RankiFacesFace | undefined) {
    assertNotUndefined(f, {
      why: "Undefined face is required",
    });
    return this.getKey() === f.getKey();
  }
}
