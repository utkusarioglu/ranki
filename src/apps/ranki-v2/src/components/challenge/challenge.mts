import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import { RankiFacesPair } from "_components/challenge/pair/pair.mts";
import { ruleStyles } from "_components/challenge/pair/rule/rule.mts";
import type { RankiChallengeState } from "_config/config.types.mts";
import styles from "./challenge.component.css?inline";

export class RankiChallenge extends RankiFacesWc<RankiChallengeState> {
  public static name = "ranki-challenge" as const;
  constructor() {
    super(true);
    this.pushStyles(styles, ruleStyles);
  }
  private list: RankiFacesPair[] = [];

  private build() {
    this.newPairs();
  }

  private createNew(curr: RankiChallengeState) {
    this.list.push(RankiFacesPair.createAndAttach(curr, this.shadowRoot!));
  }

  private removePreceding() {
    this.list.slice(0, -1).forEach((p) => p.remove());
  }

  private newPairs() {
    const curr = this.getCurr();
    if (!this.list.length) {
      this.createNew(curr);
      return;
    }

    this.removePreceding();

    const last = this.list.at(-1)!;
    if (last.canReconcile(curr)) {
      last.setProps(curr);
    } else {
      last.remove();
      this.createNew(curr);
    }
  }

  render() {
    this.build();
    return this;
  }
}
