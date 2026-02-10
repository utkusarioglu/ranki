// import {
//   RankiAnimation_OLD,
//   type AnimationTypes,
// } from "_components/animation/animation.mts";
// import { RankiFacesWc } from "_components/challenge/faces-wc/faces-wc.mts";
import styles from "./rule.css?inline";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc } from "_components/wc/wc.mjs";

export const ruleStyles = styles;

export type RankiRuleVariants = "horizontal" | "vertical";

export class RRule extends Wc<RankiRuleVariants> {
  public static readonly tag = "r-rule" as const;
  // protected animations: AnimationTypes = {
  //   enter: RankiAnimation_OLD.expandYFadeIn(this),
  //   exit: RankiAnimation_OLD.collapseYFadeOut(this),
  // };

  isActive(): boolean {
    return true;
  }

  setProps(s: RankiRuleVariants) {
    this.state.set(s);
  }

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
    // const container = this.elements.create("container", {
    //   tag: "div",
    //   classes: ["container"],
    // });
    this.classList.add("container");
    this.elements.create("hr", { tag: "div" });
  }

  protected onStateChange(curr: RankiRuleVariants): void {
    const hr = this.elements.get<HTMLDivElement>("hr")!;
    hr.className = curr;
  }

  // private build() {
  //   let hr = document.querySelector("div.container");
  //   if (hr) {
  //     return;
  //   }
  //   const curr = this.state.curr();
  //   hr = document.createElement("div");
  //   hr.classList.add(curr);
  //   this.classList.add("container");
  //   this.appendChild(hr);
  // }

  // render() {
  //   this.build();
  //   return this;
  // }
}
