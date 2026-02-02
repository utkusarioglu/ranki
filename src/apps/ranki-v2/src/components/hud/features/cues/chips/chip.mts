import "@phosphor-icons/webcomponents";
import {
  RankiAnimation,
  type AnimationTypes,
} from "_components/animation/animation.mts";
import { RankiHudWc } from "_components/hud/hud-wc/hud-wc.mts";
import type { ReconciliationAction } from "_components/ranki-wc/ranki-wc.mjs";
import type { ProcessedCue } from "_config/config.types.mts";

export class HudChipsChip extends RankiHudWc<ProcessedCue> {
  protected static name = "hud-chips-chip" as const;
  protected animations: AnimationTypes = {
    enter: RankiAnimation.fadeIn(this),
    exit: RankiAnimation.fadeOut(this),
  };

  render(): this {
    this.mutate();
    return this;
  }

  canReconcile(): ReconciliationAction {
    return "mutate";
  }
  isActive(): boolean {
    return true;
  }

  /**
   * FIX
   * This fails if the cue has no properties other than `indicator`. that means
   * this shouldn't be created in that case but it still gets created.
   */
  mutate() {
    const curr = this.getCurr();
    if (curr.background) {
      if (curr.background.color && curr.background.color !== "none") {
        this.style.background = `rgb(var(--scheme-${curr.background.color}))`;
      } else {
        this.style.removeProperty("background");
      }
    } else {
      this.style.removeProperty("background");
    }
    if (curr.icon) {
      let icon = this.querySelector(`ph-${curr.icon.id}`);
      if (!icon) {
        const oldIcon = this.querySelector(".cue-icon");
        if (oldIcon) {
          oldIcon.parentElement!.removeChild(oldIcon);
        }

        icon = document.createElement(`ph-${curr.icon.id}`);
        icon.className = "cue-icon";
        icon.setAttribute("weight", "fill");
        this.prepend(icon);
      }
      if (curr.icon.color && curr.icon.color !== "none") {
        icon.setAttribute("color", `rgb(var(--scheme-${curr.icon.color}))`);
      } else {
        icon.removeAttribute("color");
      }
    } else {
      const iconElem = this.querySelector(".cue-icon");
      if (iconElem) {
        iconElem.parentElement!.removeChild(iconElem);
      }
    }
    if (curr.message && curr.message.text) {
      let span = this.querySelector(".cue-message") as HTMLSpanElement | null;
      if (!span) {
        span = document.createElement("span");
        span.className = "cue-message";
        this.appendChild(span);
      }
      if (curr.message.color && curr.message.color !== "none") {
        span.style.color = `rgb(var(--scheme-${curr.message.color}))`;
      } else {
        span.style.removeProperty("color");
      }
      span.innerText = curr.message.text;
    } else {
      const messageElem = this.querySelector(".cue-message");
      if (messageElem) {
        messageElem.parentElement!.removeChild(messageElem);
      }
    }

    this.addClass("cue", `issuer-${curr.issuer}`, `kind-${curr.kind}`);
  }
}
