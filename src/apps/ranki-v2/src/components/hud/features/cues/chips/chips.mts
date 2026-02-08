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
    const r = s.type === "chips" ? "mutate" : "remove";
    console.log("r", r);
    return r;
  }

  protected onStateChange(curr: T): void {
    const state = curr.map((state) => ({ type: "chip", state }));
    console.log(curr, state);
    this.subtree.reconcile(state);
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueChip.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
