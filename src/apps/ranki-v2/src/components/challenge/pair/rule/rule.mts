// import {
//   RankiAnimation_OLD,
//   type AnimationTypes,
// } from "_components/animation/animation.mts";
// import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { RPairItem } from "_components/challenge/components/face.mjs";
import styles from "./rule.css?inline";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";

export const ruleStyles = styles;

export type RankiRuleVariants = "horizontal" | "vertical";

export class RPairRule extends RPairItem<RankiRuleVariants> {
  public static readonly tag = "r-pair-rule" as const;

  // DECIDE a surface area without this should be possible.
  getKey() {
    const index = this.state.curr();
    return `ranki:rule:${index}`;
  }

  canReconcile(s: WrappedState<RankiRuleVariants>): ReconciliationAction {
    const type = s.type === "ranki:rule";
    const variant = this.state.curr() === s.state;
    return type && variant ? "advance" : "remove";
  }

  initialize(): void {
    super.initialize();
    this.elements.create("hr", { tag: "div" });
  }

  protected onStateChange(curr: RankiRuleVariants): void {
    const hr = this.elements.get<HTMLDivElement>("hr")!;
    hr.className = curr;
  }
}
