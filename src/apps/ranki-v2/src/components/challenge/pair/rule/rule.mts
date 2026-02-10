import { RPairItem } from "_components/challenge/components/face.mjs";
import styles from "./rule.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";

export const ruleStyles = styles;

export type RankiRuleVariants = "horizontal" | "vertical";

export class RPairRule extends RPairItem<RankiRuleVariants> {
  public static readonly tag = "r-pair-rule" as const;

  // DECIDE a surface area without this should be possible.
  // getKey() {
  //   return `ranki:rule`;
  // }

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
