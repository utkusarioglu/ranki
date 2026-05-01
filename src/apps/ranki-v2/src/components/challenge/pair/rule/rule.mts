import { RPairItem } from "_components/challenge/components/face.mjs";
import styles from "./rule.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";

export const ruleStyles = styles;

export type RankiRuleVariants = {
  animation: {
    enabled: boolean;
  };
  variant: "horizontal" | "vertical";
};

export class RPairRule extends RPairItem<RankiRuleVariants> {
  public static readonly tag = "r-pair-rule" as const;

  canReconcile(s: WrappedState<RankiRuleVariants>): ReconciliationAction {
    const type = s.type === "ranki:rule";
    const variant = this.state.curr().variant === s.state.variant;
    const can = type && variant ? "advance" : "remove";
    return can;
  }

  initialize(): void {
    super.initialize();
    this.elements.create("hr", { tag: "div" });
  }

  protected onStateChange(curr: RankiRuleVariants): void {
    this.className = curr.variant;
  }
}
