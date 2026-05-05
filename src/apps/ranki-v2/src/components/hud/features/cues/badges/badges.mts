import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueBadge } from "./badge.mts";
import styles from "./badges.component.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";
import type { CueComponentCommon } from "../cues.mts";

const DUR = 4e2;

export class RCueBadges extends WcHudContainer<
  CueComponentCommon,
  CueComponentCommon,
  RCueBadge,
  ProcessedCue
> {
  static readonly tag = "r-cue-badges";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  // hasNext(n: boolean) {
  //   this.css.set({ "margin-right": n ? "0.5em" : 0 });
  // }

  hasNext(n: boolean) {
    const curr = this.state.curr();
    const m = this.css.getMarginRight();
    this.animation.animate("margin-right", {
      keyframes: [
        {
          marginRight: m,
        },
        {
          marginRight: n ? "8px" : 0,
        },
      ],
      options: {
        duration: curr.animation.enabled ? DUR : 0,
        fill: "both",
      },
    });
  }

  canReconcile(s: WrappedState<CueComponentCommon>): ReconciliationAction {
    return s.type === "badges" ? "mutate" : "remove";
  }

  protected onStateChange(curr: CueComponentCommon): void {
    console.log("c", curr);
    this.subtree.reconcile(
      curr.list.map((state) => ({ type: "badge", state })),
    );
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueBadge.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
