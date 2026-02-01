import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mjs";
import { HudLabelsLabel } from "./label.mts";
import styles from "./labels.component.css?inline";

export class HudLabels extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-labels" as const;
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
    if (!container) {
      return;
    }
    const lastIndex = this.getCurr().length - 1;
    if (lastIndex === -1) {
      return;
    }
    const right = (
      container.childNodes[lastIndex] as HudLabelsLabel
    ).getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    const [container] = this.createSingletonContainer();
    const props = this.getCurr();
    const cn = container.childNodes.length;
    const sn = props.length;
    const rm: HudLabelsLabel[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const record = props[i];
      if (record) {
        const cue = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HudLabelsLabel;
        if (!cue) {
          HudLabelsLabel.createAndAttach(
            { record: record, index: i },
            container,
          );
        } else {
          cue.setMutations(record);
        }
      } else {
        rm.push(container.childNodes[i] as HudLabelsLabel);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.remove();
      });
    this.adjustWidth();
    return container;
  }

  render() {
    const props = this.getCurr();
    if (props.length) {
      this.build();
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
    return this;
  }
}
