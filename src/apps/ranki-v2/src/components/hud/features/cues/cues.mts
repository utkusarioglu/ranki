import type { CueRecord } from "../../../../config/config.types.mts";
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
      twoRafCb: this.adjustWidth.bind(this),
    }),
    hide: RankiAnimation.expandXFadeIn(this, {
      twoRaf: {
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
    const container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }

    const right = (
      container.childNodes[this.getCurr().length - 1] as HudCuesCue
    ).getRight();
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private container() {
    const c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    const container = document.createElement("div");
    container.classList.add("container");
    this.shadowRoot!.replaceChildren(container);
    return container;
  }

  private build() {
    const container = this.container();
    const props = this.getCurr();
    const cn = container.childNodes.length;
    const sn = props.length;
    const rm: HudCuesCue[] = [];

    for (let i = 0; i < Math.max(cn, sn); i++) {
      const s = props[i];
      if (s) {
        const e = this.shadowRoot!.querySelector(
          `[data-index="${i}"]`,
        ) as HTMLDivElement;
        if (!e) {
          this.createCue(s, i, container);
        } else {
          this.mutateCue(s, e);
        }
      } else {
        rm.push(container.childNodes[i] as HudCuesCue);
      }
    }
    rm.length &&
      rm.forEach((r) => {
        r.remove();
      });
    this.adjustWidth();
    return container;
  }

  private createCue(c: CueRecord, i: number, container: HTMLDivElement) {
    const cue = HudCuesCue.create({}, container);
    cue.innerText = c.message || c.indicator;
    cue.addClass("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    cue.setAttribute("data-index", i.toString());
  }

  private mutateCue(s: CueRecord, e: HTMLDivElement) {
    e.innerText = s.message;
  }

  render() {
    const props = this.getCurr();
    if (props.length) {
      this.build();
      this.runAnimation("show");
    } else {
      this.runAnimation("hide");
    }
  }
}
