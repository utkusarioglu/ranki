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

type Subtree = RankiWc<ProcessedCue[]>[];

export class HudCues extends RankiHudWc<ProcessedCueMapHud> {
  protected static name = "ranki-hud-cues" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.fadeIn(this, {
      // initialCb: this.adjustWidth.bind(this),
      setup: {
        "margin-right": 0,
      },
      initial: {
        "margin-right": "1em",
      },
    }),
    hide: RankiAnimation.fadeOut(this, {
      setup: {
        "margin-right": "1em",
      },
      initial: {
        "margin-right": 0,
      },
    }),
  };
  private subtree: Subtree = [];

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  // private adjustWidth() {
  //   const container = this.getContainer();
  //   if (!container) return;
  //   const left = this.getLeft();
  //   const last = this.subtree.at(-1);
  //   const right = last?.getRight() || left;
  //   this.setProperties({ width: right - left + "px" });
  // }

  private build() {
    const [container, exists] = this.createSingletonContainer();
    if (exists) return;
    const curr = this.getCurr();
    [
      HudBadges.singleton(curr.badges, container),
      HudChips.singleton(curr.chips, container),
      HudLabels.singleton(curr.labels, container),
    ].forEach((h) => this.subtree.push(h));
  }

  private reconcile() {
    const curr = this.getCurr();
    [curr.badges, curr.chips, curr.labels].forEach((c, i) => {
      this.subtree[i].setProps(c);
    });
  }

  render(): this {
    const curr = this.getCurr();
    this.build();
    if (curr.count) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.reconcile();
    return this;
  }
}
