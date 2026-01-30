import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiWc } from "_components/ranki-wc/ranki-wc.mts";

export class IndicatorPattern extends RankiWc<string> {
  public static name = "ranki-indicator-pattern" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };

  // private container() {
  //   let div = this.querySelector("div.container") as HTMLDivElement;
  //   if (div) {
  //     return div;
  //   }
  //   div = document.createElement("div");
  //   div.classList.add("container");
  //   this.replaceChildren(div);
  //   return div;
  // }

  build() {
    const curr = this.getCurr();
    // const container = this.container();
    this.style.background = curr;
  }

  render(): this {
    this.build();
    return this;
  }
}
