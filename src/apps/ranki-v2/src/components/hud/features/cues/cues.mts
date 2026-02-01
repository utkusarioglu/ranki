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
    show: RankiAnimation.expandMarginRight(this, {}),
    hide: RankiAnimation.collapseMarginRight(this, {}),
  };
  private subtree: Subtree = [];

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private build() {
    const curr = this.getCurr();
    const [container, exists] = this.createSingletonContainer();
    if (exists) {
      [curr.badges, curr.chips, curr.labels].forEach((c, i) => {
        this.subtree[i].setProps(c);
      });
      return;
    }
    [
      HudBadges.singleton(curr.badges, container),
      HudChips.singleton(curr.chips, container),
      HudLabels.singleton(curr.labels, container),
    ].forEach((h) => this.subtree.push(h));
  }
  render(): this {
    const curr = this.getCurr();
    this.build();
    if (curr.count) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    return this;
  }
}
