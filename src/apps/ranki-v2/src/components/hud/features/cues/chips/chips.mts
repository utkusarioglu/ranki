import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueChip } from "./chip.mts";
import styles from "./chips.component.css?inline";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

type T = ProcessedCue[];

export class RCueChips extends WcHudContainer<T, T, RCueChip, ProcessedCue> {
  static readonly tag = "r-cue-chips";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "0.5em" : 0 });
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    console.log(s);
    return s.type === "chips" && !!this.subtree.getAll().length
      ? "mutate"
      : "remove";
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(curr.map((state) => ({ type: "label", state })));
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueChip.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
