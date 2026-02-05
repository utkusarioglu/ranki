import {
  RankiAnimation_OLD,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import styles from "./rule.css?inline";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";

export const ruleStyles = styles;

export type RankiRuleVariants = "horizontal" | "vertical";

export class RankiRule extends RankiFacesWc<RankiRuleVariants> {
  public static name = "ranki-rule" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation_OLD.expandYFadeIn(this),
    exit: RankiAnimation_OLD.collapseYFadeOut(this),
  };

  isActive(): boolean {
    return true;
  }

  // DECIDE a surface area without this should be possible.
  getKey() {
    const index = this.getCurr();
    return `ranki:rule:${index}`;
  }

  canReconcile(s: WrappedState<RankiRuleVariants>): ReconciliationAction {
    const type = s.type === "ranki:rule";
    const variant = this.getCurr() === s.state;
    return type && variant ? "advance" : "remove";
  }

  canReconcile_old(oi: WrappedState<number>): ReconciliationAction {
    return oi.type === "ranki:rule" ? "advance" : "remove";
  }

  private build() {
    let hr = document.querySelector("div.container");
    if (hr) {
      return;
    }
    const curr = this.getCurr();
    hr = document.createElement("div");
    hr.classList.add(curr);
    this.classList.add("container");
    this.appendChild(hr);
  }

  render() {
    this.build();
    return this;
  }
}
