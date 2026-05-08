import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueChip } from "./chip.mts";
import styles from "./chips.component.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";
import type { CueComponentCommon } from "../cues.mts";

const DUR = 4e2;

export class RCueChips extends WcHudContainer<
  CueComponentCommon,
  CueComponentCommon,
  RCueChip,
  ProcessedCue
> {
  static readonly tag = "r-cue-chips";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

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
    return s.type === "chips" ? "mutate" : "remove";
  }

  protected onStateChange(curr: CueComponentCommon): void {
    const state = curr.list.map((state) => ({ type: "chip", state }));
    this.subtree.reconcile(state);
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueChip.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
