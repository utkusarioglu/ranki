import {
  RankiAnimation,
  type AnimationTypes,
} from "../../animation/animation.mts";
import type { RankiFacesFace } from "./face/face.mts";
import { RankiFacesWc } from "../faces-wc/faces-wc.mts";
import type { RankiRule } from "./rule/rule.mts";

export type PairChildren = RankiFacesFace | RankiRule;

export class RankiFacesPair extends RankiFacesWc<{}> {
  public static name = "ranki-faces-pair" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.slideUpFadeIn(this),
    exit: RankiAnimation.slideUpFadeOut(this),
  };

  getContainer(): HTMLDivElement {
    return this.querySelector(".container")!;
  }

  getChildren(): HTMLElement[] {
    return Array.from(this.getContainer().children) as PairChildren[];
  }

  build() {
    let div = this.querySelector("div.container");
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
