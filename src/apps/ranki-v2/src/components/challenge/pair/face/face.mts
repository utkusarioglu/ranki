import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class RankiFacesFace extends RankiFacesWc<any> {
  public static name = "ranki-faces-face";
  protected animations: AnimationTypes = {
    enter: RankiAnimation_OLD.expandYFadeIn(this),
    exit: RankiAnimation_OLD.collapseYFadeOut(this),
  };

  isActive(): boolean {
    return true;
  }

  getKey() {
    return this.getAttribute("dqm-source");
  }

  setKey(key: string) {
    this.setAttribute("dqm-source", key);
  }

  canReconcile(s: WrappedState<RankiFacesFace>): ReconciliationAction {
    assertNotUndefined(s, {
      why: "Undefined face is required",
    });
    return this.getKey() === s.state.getKey() ? "advance" : "remove";
  }

  canReconcile_old(s: WrappedState<RankiFacesFace>): ReconciliationAction {
    assertNotUndefined(s, {
      why: "Undefined face is required",
    });
    return this.getKey() === s.state.getKey() ? "advance" : "remove";
  }

  protected render() {}
}
