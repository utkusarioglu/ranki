import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import type { RankiFacesFace } from "_components/challenge/pair/face/face.mts";
import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import type { RankiRule } from "_components/challenge/pair/rule/rule.mts";

export type PairChildren = RankiFacesFace | RankiRule;

export class RankiFacesPair extends RankiFacesWc<{}> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.slideUpFadeIn(this),
    exit: RankiAnimation.slideUpFadeOut(this),
  };

  getContainer(): HTMLDivElement {
    return this.querySelector("ranki-faces-pair > .container")!;
  }

  getChildren(): HTMLElement[] {
    return Array.from(this.getContainer().children) as PairChildren[];
  }

  build() {
    let div = this.querySelector("ranki-faces-pair > .container");
    if (div) {
      return;
    }
    div = document.createElement("div") as HTMLDivElement;
    div.classList.add("container");
    this.appendChild(div);
  }

  render() {
    this.build();
    return this;
  }
}
