import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import styles from "./rule.css?inline";

export const ruleStyles = styles;

type Variants = "horizontal" | "vertical";

export class RankiRule extends RankiFacesWc<number> {
  public static name = "ranki-rule" as const;
  private variant: Variants = "horizontal";
  protected animations: AnimationTypes = {
    enter: RankiAnimation.expandYFadeIn(this),
    exit: RankiAnimation.collapseYFadeOut(this),
  };

  getKey() {
    const index = this.getCurr();
    return `ranki:rule:${index}`;
  }

  checkKey(oi: number) {
    const ruleKey = `ranki:rule:${oi}`;
    return this.getKey() === ruleKey;
  }

  setVariant(v: "horizontal" | "vertical") {
    this.variant = v;
    return this;
  }

  private build() {
    let hr = document.querySelector("div.container");
    if (hr) {
      return;
    }
    hr = document.createElement("div");
    hr.classList.add(this.variant);
    this.classList.add("container");
    this.appendChild(hr);
  }

  render() {
    this.build();
    return this;
  }
}
