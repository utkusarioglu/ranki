import { RankiAnimation } from "../../../animation/animation.mts";
import { RankiHudWc } from "../../hud-wc/hud-wc.mts";
import { type AnimationTypes } from "../../../animation/animation.mts";
import type { CueRecord } from "../../../../config/config.types.mts";
import "@phosphor-icons/webcomponents";

type CueProps = {
  record: CueRecord;
  index: number;
};

export class HudCuesCue extends RankiHudWc<CueProps> {
  protected static name = "hud-cues-cue" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };

  render(): this {
    this.mutate();
    return this;
  }

  setMutations(c: CueRecord) {
    this.setProps({ record: c, index: this.getCurr().index });
  }

  mutate() {
    const curr = this.getCurr();
    const c = curr.record;
    if (c.bgColor) {
      this.style.background = `rgb(var(--scheme-${c.bgColor}))`;
    } else {
      this.style.removeProperty("background");
    }
    if (c.icon) {
      let icon = this.querySelector(`ph-${c.icon}`);
      if (!icon) {
        const oldIcon = this.querySelector(".cue-icon");
        if (oldIcon) {
          oldIcon.parentElement!.removeChild(oldIcon);
        }

        icon = document.createElement(`ph-${c.icon}`);
        icon.className = "cue-icon";
        icon.setAttribute("weight", "fill");
        this.prepend(icon);
      }
      if (c.iconColor) {
        icon.setAttribute("color", `rgb(var(--scheme-${c.iconColor}))`);
      } else {
        icon.removeAttribute("color");
      }
    } else {
      const iconElem = this.querySelector(".cue-icon");
      if (iconElem) {
        iconElem.parentElement!.removeChild(iconElem);
      }
    }
    if (c.message) {
      let span = this.querySelector(".cue-message") as HTMLSpanElement | null;
      if (!span) {
        span = document.createElement("span");
        span.className = "cue-message";
        this.appendChild(span);
      }
      if (c.textColor) {
        span.style.color = `rgb(var(--scheme-${c.textColor}))`;
      } else {
        span.style.removeProperty("color");
      }
      span.innerText = c.message;
    } else {
      const messageElem = this.querySelector(".cue-message");
      if (messageElem) {
        messageElem.parentElement!.removeChild(messageElem);
      }
    }
    // this.innerText = c.message || c.indicator || "";

    this.addClass("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    this.setAttribute("data-index", curr.index.toString());
  }
}
