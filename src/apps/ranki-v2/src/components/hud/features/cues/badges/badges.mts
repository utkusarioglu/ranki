import { WcHudContainer } from "_components/hud/components/container.mjs";
import type { ProcessedCue } from "_config/config.types.mjs";
import { RCueBadge } from "./badge.mts";
import styles from "./badges.component.css?inline";
import type { WrappedState } from "_components/subtree/subtree.mjs";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";

type T = ProcessedCue[];

export class RCueBadges extends WcHudContainer<T, T, RCueBadge, ProcessedCue> {
  static readonly tag = "r-cue-badges";

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  hasNext(n: boolean) {
    this.css.set({ "margin-right": n ? "0.5em" : 0 });
  }

  canReconcile(s: WrappedState<T>): ReconciliationAction {
    return s.type === "badges" ? "mutate" : "remove";
  }

  protected onStateChange(curr: T): void {
    this.subtree.reconcile(curr.map((state) => ({ type: "badge", state })));
  }

  protected createSubtreeChild(s: WrappedState<ProcessedCue>) {
    const container = this.elements.get("container");
    const ch = RCueBadge.create.instance(s.state, container);
    this.animation.pushDependency("width", ch);
    return ch;
  }
}
