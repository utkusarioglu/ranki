import { RPair } from "_components/challenge/pair/pair.mts";
import { ruleStyles } from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mts";
import styles from "./challenge.component.css?inline";
import { type WrappedState } from "_components/subtree/subtree.mjs";
import type { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";
import { Wc } from "_components/wc/wc.mjs";
import { WcSub } from "_components/wc/sub.mjs";

export class RChallenge extends Wc<RankiChallengeState> {
  public static name = "r-challenge" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles, ruleStyles);
  }

  initialize(): void {}

  private subtree = new WcSub<
    // @ts-expect-error
    RankiWc<RankiChallengeState>,
    RankiChallengeState
  >({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  private createSubtreeChild(curr: WrappedState<RankiChallengeState>) {
    return RPair.create.instance(curr.state, this.shadowRoot!);
  }

  private removeSubtreeChild(e: RPair) {
    e.remove();
  }

  protected onStateChange(curr: RankiChallengeState): void {
    this.subtree.reconcile([
      {
        type: "pair",
        state: curr,
      },
    ]);
  }
}
