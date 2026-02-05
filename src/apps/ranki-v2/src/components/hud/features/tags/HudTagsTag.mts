import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { HudTagListItem } from "_components/hud/hud.types.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";

export class HudTagsTag extends RankiHudWc<HudTagListItem> {
  protected static name = "hud-tags-tag" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation_OLD.fadeIn(this),
    exit: RankiAnimation_OLD.fadeOut(this),
  };

  isActive(): boolean {
    return true;
  }

  canReconcile(_s: WrappedState<HudTagListItem>): ReconciliationAction {
    return "mutate";
  }

  render() {
    const curr = this.getCurr();
    this.addClass(curr.type);
    this.innerText = curr.text;
    return this;
  }
}
