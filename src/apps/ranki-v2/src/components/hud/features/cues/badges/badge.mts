import "@phosphor-icons/webcomponents";
import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ProcessedCue } from "_config/config.types.mts";

type CueProps = {
  record: ProcessedCue;
  index: number;
};

export class HudBadgesBadge extends RankiHudWc<CueProps> {
  protected static name = "hud-badges-badge" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };

  render(): this {
    this.mutate();
    return this;
  }

  setMutations(c: ProcessedCue) {
    this.setProps({ record: c, index: this.getCurr().index });
  }

  /**
   * FIX
   * This fails if the cue has no properties other than `indicator`. that means
   * this shouldn't be created in that case but it still gets created.
   */
  mutate() {
    const curr = this.getCurr();
    const c = curr.record;
    this.setProperties({ "z-index": 100 - curr.index });
    if (c.background) {
      if (c.background.color && c.background.color !== "none") {
        this.style.background = `rgb(var(--scheme-${c.background.color}))`;
      } else {
        this.style.removeProperty("background");
      }
    } else {
      this.style.removeProperty("background");
    }
    if (c.icon) {
      let icon = this.querySelector(`ph-${c.icon.id}`);
      if (!icon) {
        const oldIcon = this.querySelector(".cue-icon");
        if (oldIcon) {
          oldIcon.parentElement!.removeChild(oldIcon);
        }

        icon = document.createElement(`ph-${c.icon.id}`);
        icon.className = "cue-icon";
        icon.setAttribute("weight", "fill");
        this.prepend(icon);
      }
      if (c.icon.color && c.icon.color !== "none") {
        icon.setAttribute("color", `rgb(var(--scheme-${c.icon.color}))`);
      } else {
        icon.removeAttribute("color");
      }
    } else {
      const iconElem = this.querySelector(".cue-icon");
      if (iconElem) {
        iconElem.parentElement!.removeChild(iconElem);
      }
      this.setProperties({ width: "20px" });
    }
    // if (c.message && c.message.text) {
    //   let span = this.querySelector(".cue-message") as HTMLSpanElement | null;
    //   if (!span) {
    //     span = document.createElement("span");
    //     span.className = "cue-message";
    //     this.appendChild(span);
    //   }
    //   if (c.message.color && c.message.color !== "none") {
    //     span.style.color = `rgb(var(--scheme-${c.message.color}))`;
    //   } else {
    //     span.style.removeProperty("color");
    //   }
    //   span.innerText = c.message.text;
    // } else {
    //   const messageElem = this.querySelector(".cue-message");
    //   if (messageElem) {
    //     messageElem.parentElement!.removeChild(messageElem);
    //   }
    // }

    this.addClass("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
    this.setAttribute("data-index", curr.index.toString());
  }
}
