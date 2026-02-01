import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudLabelsLabel } from "./label.mts";
import styles from "./labels.component.css?inline";
import { Subtree } from "_components/subtree/subtree.mjs";
import { assertNotNull } from "_error/assertions.mjs";

export class HudLabels extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-labels" as const;
  private subtree = new Subtree<HudLabelsLabel, ProcessedCue>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
      // setup: {
      //   // "margin-left": 0,
      // },
      // initial: {
      //   "margin-left": "0.5em",
      // },
    }),
    hide: RankiAnimation.collapseXFadeOut(this, {
      // setup: {
      //   "margin-left": "0.5em",
      // },
      // initial: {
      //   "margin-left": 0,
      // },
    }),
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
    const child = HudLabelsLabel.create<ProcessedCue, HudLabelsLabel>(inc);
    container.appendChild(child);
    return child;
  }

  private removeSubtreeChild(e: HudLabelsLabel) {
    e.remove();
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
