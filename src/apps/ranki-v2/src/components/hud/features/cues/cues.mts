import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";
import { RankiAnimation } from "../../../animation/animation.mts";
import type { HudCuesProps } from "../../hud.types.mts";
import styles from "./cues.component.css?inline";
import { HudCuesCue } from "./hud-cue.mts";

export class HudCues extends RankiHudWc<HudCuesProps> {
  protected static name = "ranki-hud-cues" as const;
  protected animations: AnimationTypes = {
    show: RankiAnimation.expandXFadeIn(this, {
      initialCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.expandXFadeIn(this, {
      initial: {
        "margin-right": 0,
        opacity: 0,
      },
    }),
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
    const right = (container.childNodes[lastIndex] as HudCuesCue).getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private build() {
    const [container] = this.createSingletonContainer();
    const props = this.getCurr();
    const cn = container.childNodes.length;
    const sn = props.length;
    const rm: HudCuesCue[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const record = props[i];
      if (record) {
        const cue = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HudCuesCue;
        if (!cue) {
          HudCuesCue.createAndAttach({ record: record, index: i }, container);
        } else {
          cue.setMutations(record);
        }
      } else {
        rm.push(container.childNodes[i] as HudCuesCue);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        this.removeCue(r);
      });
    this.adjustWidth();
    return container;
  }

  private removeCue(r: HudCuesCue) {
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
