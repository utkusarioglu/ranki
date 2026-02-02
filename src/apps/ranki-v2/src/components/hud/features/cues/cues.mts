import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type {
  ProcessedCue,
  ProcessedCueMapHud,
} from "_config/config.types.mjs";
import { HudBadges } from "./badges/badges.mts";
import { HudChips } from "./chips/chips.mts";
import { HudLabels } from "./labels/labels.mts";
import styles from "./cues.component.css?inline";
import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mjs";
import type {
  RankiWc,
  ReconciliationAction,
} from "_components/ranki-wc/ranki-wc.mjs";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import { Subtree, type WrappedState } from "_components/subtree/subtree.mjs";

type ChildTypes = "badges" | "chips" | "labels";

interface Wrapped {
  type: ChildTypes;
  state: ProcessedCue[];
}

export class HudCues extends RankiHudWc<ProcessedCueMapHud> {
  protected static name = "ranki-hud-cues" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.fadeIn(this),
    hide: RankiAnimation.fadeOut(this),
  };
  private subtree = new Subtree<RankiWc<ProcessedCue[]>, ProcessedCue[]>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private createSubtreeChild(state: Wrapped) {
    const container = this.getContainer();
    assertNotNull(container, { why: "No container to place children in" });
    switch (state.type) {
      case "badges":
        return HudBadges.singleton(state.state, container);
      case "chips":
        return HudChips.singleton(state.state, container);
      case "labels":
        return HudLabels.singleton(state.state, container);
      default:
        assertNever({
          why: "Unrecognized cue type",
          details: { state },
        });
    }
  }

  private build() {
    this.createSingletonContainer();
  }

  private removeSubtreeChild(e: RankiWc<ProcessedCue[]>) {
    e.remove();
  }

  isActive(): boolean {
    return !!this.getCurr().count;
  }

  hasNext(n: boolean) {
    this.setProperties({ "margin-right": n ? "1em" : 0 });
  }

  canReconcile(s: WrappedState<ProcessedCueMapHud>): ReconciliationAction {
    return s.type === "cues" ? "mutate" : "remove";
  }

  render(): this {
    const curr = this.getCurr();
    this.build();
    if (curr.count) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(
      Object.entries(curr.subtree).map(([type, state]) => ({
        type: type as ChildTypes,
        state,
      })),
    );
    return this;
  }
}
