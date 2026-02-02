import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { RankiFacesPair } from "_components/challenge/pair/pair.mts";
import { ruleStyles } from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mts";
import styles from "./challenge.component.css?inline";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";

export class RankiChallenge extends RankiFacesWc<RankiChallengeState> {
  public static name = "ranki-challenge" as const;
  constructor() {
    super(true);
    this.pushStyles(styles, ruleStyles);
  }
  private subtree = new Subtree<RankiFacesPair, RankiChallengeState>({
    // @ts-expect-error
    create: this.createNewPair.bind(this),
    remove: this.removePair.bind(this),
  });

  private createNewPair(curr: WrappedState<RankiChallengeState>) {
    const elem = RankiFacesPair.createAndAttach(curr.state, this.shadowRoot!);
    this.shadowRoot!.appendChild(elem);
    return elem;
  }

  private removePair(e: RankiFacesPair) {
    e.remove();
  }

  render() {
    this.subtree.reconcile([
      {
        type: "pair",
        state: this.getCurr(),
      },
    ]);
    return this;
  }
}
