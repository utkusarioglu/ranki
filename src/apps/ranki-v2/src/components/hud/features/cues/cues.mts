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
import type { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";
import { assertNever, assertNotNull } from "_error/assertions.mjs";
import { Subtree } from "_components/subtree/subtree.mjs";

// type Subtree = RankiWc<ProcessedCue[]>[];

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

  // private subtree: Subtree = [];

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private createSubtreeChild(state: Wrapped) {
    const container = this.getContainer();
    assertNotNull(container, { why: "No container to place children in" });
    let child;
    // child.setZIndex(100 - this.subtree.getSize());

    switch (state.type) {
      case "badges":
        child = HudBadges.singleton(state.state, container);
        break;
      case "chips":
        child = HudChips.singleton(state.state, container);
        break;
      case "labels":
        child = HudLabels.singleton(state.state, container);
        break;
      default:
        assertNever({
          why: "Unrecognized cue type",
          details: { state },
        });
    }
    container.appendChild(child);
    return child;
  }

  private build() {
    this.createSingletonContainer();
    // if (exists) return;
    // const ELEMS = ["badges", "chips", "labels"];

    // ELEMS.forEach((e) => {
    //   switch (e) {
    //     case "badges":
    //       break;
    //     case "chips":
    //       break;
    //     case "labels":
    //       break;
    //     default:
    //       assertNever({ why: "Unrecognized cue type", details: { e } });
    //   }
    // });
    // const curr = this.getCurr();
    // [
    //   HudBadges.singleton(curr.badges, container),
    //   HudChips.singleton(curr.chips, container),
    //   HudLabels.singleton(curr.labels, container),
    // ].forEach((h) => this.subtree.push(h));
  }

  private removeSubtreeChild(e: RankiWc<ProcessedCue[]>) {
    e.remove();
  }

  // private reconcile() {
  //   const curr = this.getCurr();
  //   [curr.badges, curr.chips, curr.labels]
  //     .map((props, i, a) => {
  //       if (a[i + 1]?.length && a[i].length) {
  //         return {
  //           props,
  //           hasNextNeighbor: true,
  //         };
  //       } else {
  //         return {
  //           props: props,
  //           hasNextNeighbor: false,
  //         };
  //       }
  //     })
  //     .forEach((c, i) => {
  //       this.subtree[i].setProps(c.props);
  //       // e.setProps(c.props);
  //       // e.setProperties({ "margin-right": c.hasNextNeighbor ? "0.5em" : "0" });
  //     });
  // }

  isActive(): boolean {
    return !!this.getCurr().count;
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
      Object.entries(curr.features).map(([type, state]) => ({
        type: type as ChildTypes,
        state,
      })),
    );
    return this;
  }
}
