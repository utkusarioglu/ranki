import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueLabel } from "./label.mts";
import styles from "./labels.component.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";
import type { CueComponentCommon } from "../cues.mts";

const DUR = 4e2;

export class RCueLabels extends WcHudContainer<
  CueComponentCommon,
  CueComponentCommon,
  RCueLabel,
  ProcessedCue
> {
  static readonly tag = "r-cue-labels";

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
    return s.type === "labels" ? "mutate" : "remove";
  }

  protected onStateChange(curr: CueComponentCommon): void {
    this.subtree.reconcile(
      curr.list.map((state) => ({ type: "label", state })),
    );
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueLabel.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
