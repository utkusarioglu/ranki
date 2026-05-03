import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueLabel } from "./label.mts";
import styles from "./labels.component.css?inline";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";

type T = ProcessedCue[];

export class RCueLabels extends WcHudContainer<T, T, RCueLabel, ProcessedCue> {
  static readonly tag = "r-cue-labels";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "0.5em" : 0 });
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "labels" ? "mutate" : "remove";
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(curr.map((state) => ({ type: "label", state })));
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueLabel.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
