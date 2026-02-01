import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type {} from "_components/hud/hud.types.mts";
import styles from "./cues.component.css?inline";
import { HudCuesChip } from "./cue-chip.mts";
import type { ProcessedCue } from "_config/config.types.mjs";

export class HudCues extends RankiHudWc<ProcessedCue[]> {
  protected static name = "ranki-hud-cues" as const;
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
    const right = (container.childNodes[lastIndex] as HudCuesChip).getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    const [container] = this.createSingletonContainer();
    const props = this.getCurr();
    const cn = container.childNodes.length;
    const sn = props.length;
    const rm: HudCuesChip[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const record = props[i];
      if (record) {
        const cue = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HudCuesChip;
        if (!cue) {
          HudCuesChip.createAndAttach({ record: record, index: i }, container);
        } else {
          cue.setMutations(record);
        }
      } else {
        rm.push(container.childNodes[i] as HudCuesChip);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        this.removeCue(r);
      });
    this.adjustWidth();
    return container;
  }

  private removeCue(r: HudCuesChip) {
    r.remove();
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
