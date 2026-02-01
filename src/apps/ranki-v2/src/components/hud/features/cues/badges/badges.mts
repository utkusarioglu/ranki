import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudBadgesBadge } from "./badge.mts";
import styles from "./badges.component.css?inline";
import { Subtree } from "_components/subtree/subtree.mjs";
import { assertNotNull } from "_error/assertions.mjs";

export class HudBadges extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-badges" as const;
  private subtree = new Subtree<HudBadgesBadge, ProcessedCue>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {}),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private adjustWidth() {
    const container = this.getContainer();
    if (!container) return;
    const left = this.getLeft();
    const last = this.subtree.getLast();
    const right = last?.getRight() || left;
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    this.createSingletonContainer();
  }

  private createSubtreeChild(inc: ProcessedCue) {
    const container = this.getContainer();
    assertNotNull(container, { why: "No container to place children in" });
    const child = HudBadgesBadge.create<ProcessedCue, HudBadgesBadge>(inc);
    child.setZIndex(100 - this.subtree.getSize());
    container.appendChild(child);
    return child;
  }

  private removeSubtreeChild(e: HudBadgesBadge) {
    e.remove();
    // this.getContainer()?.removeChild(e);
  }

  render() {
    const props = this.getCurr();
    this.build();
    if (props.length) {
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    this.subtree.reconcile(props);
    return this;
  }
}
