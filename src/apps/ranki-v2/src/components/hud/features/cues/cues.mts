import styles from "./cues.component.css?inline";
import { WcHudContainer } from "_components/hud/components/container.mjs";
import type {
  ProcessedCue,
  ProcessedCueMapHud,
  RankiPropAnimationBlock,
} from "_config/config.types.mjs";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import { RCueLabels } from "./labels/labels.mts";
import { RCueChips } from "./chips/chips.mts";
import { RCueBadges } from "./badges/badges.mts";
import type { WrappedState } from "_components/wc/sub.mjs";
import type { ReconciliationAction } from "_components/wc/wc.mjs";

type T = ProcessedCueMapHud;

type ChildTypes = "badges" | "chips" | "labels";

// interface Wrapped {
//   type: ChildTypes;
//   state: ProcessedCue[];
// }

export type CueComponentCommon = {
  animation: RankiPropAnimationBlock;
  list: ProcessedCue[];
};

export class RCues extends WcHudContainer<
  T,
  T,
  WcHudContainer<any, any, any, any>,
  CueComponentCommon
> {
  public static readonly tag = "r-cues" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  protected createSubtreeChild(state: WrappedState<CueComponentCommon>) {
    const container = this.elements.get("container");
    assertNotNull(container, { why: "No container to place children in" });
    switch (state.type) {
      case "badges":
        return RCueBadges.create.instance(state.state, container);
      case "chips":
        return RCueChips.create.instance(state.state, container);
      case "labels":
        return RCueLabels.create.instance(state.state, container);
      default:
        assertNever({
          why: "Unrecognized cue type",
          details: { state },
        });
    }
  }

  isActive(): boolean {
    return !!this.state.curr().count;
  }

  canReconcile(s: WrappedState<ProcessedCueMapHud>): ReconciliationAction {
    return s.type === "cues" ? "mutate" : "remove";
  }

  protected onStateChange(curr: ProcessedCueMapHud): void {
    const state = Object.entries(curr.subtree).map(([type, state]) => ({
      type: type as ChildTypes,
      state: {
        animation: curr.animation,
        list: state.map((s) => ({ ...s, animation: curr.animation })),
      },
    }));
    this.subtree.reconcile(state);
  }
}
