import "@phosphor-icons/webcomponents";
import { WcChip } from "_components/hud/components/chip.mjs";
import { RIcon } from "_components/icon/icon.mjs";
import { RText } from "_components/text/text.mjs";
import type { CueRecord, ProcessedCue } from "_config/config.types.mjs";

type T = ProcessedCue;

export class RCueLabel extends WcChip<T> {
  static readonly tag = "r-cue-label";

  initialize(): void {
    const icon = RIcon.create.instance(null, this);
    this.elements.push("icon", icon);
    this.animation.pushDependency("width", icon);

    // this.elements.create("icon", {
    //   tag: "div",
    //   classes: ["icon"],
    // });
    super.initialize();
  }

  private mutateMessage(message: CueRecord["message"]) {
    const text = this.elements.get<RText>("text")!;
    if (message) {
      text.state.set(message);
    } else {
      // text.remove();
    }
    // if (message && message.text) {
    //   if (message.color && message.color !== "none") {
    //     this.css.set({
    //       color: `rgb(var(--scheme-${message.color}))`,
    //     });
    //   } else {
    //     this.css.remove(["color"]);
    //   }
    //   text.state.set({ text: message.text });
    // } else {
    //   text.state.set({ text: "" });
    // }
  }

  private mutateBackground(background: CueRecord["background"]) {
    if (background) {
      if (background.color && background.color !== "none") {
        this.style.background = `rgb(var(--scheme-${background.color}))`;
      } else {
        this.style.removeProperty("background");
      }
    } else {
      this.style.removeProperty("background");
    }
  }

  private mutateIcon(recordIcon: CueRecord["icon"]) {
    const icon = this.elements.get<RIcon>("icon")!;
    console.log("r", recordIcon, icon);
    if (recordIcon) {
      console.log("set", recordIcon.id);
      icon.state.set({ icon: recordIcon.id });
    } else {
      console.log("else");
      // icon.remove();
    }
    // if (recordIcon) {
    //   let icon = this.querySelector(`ph-${recordIcon.id}`);
    //   if (!icon) {
    //     const oldIcon = this.querySelector(".cue-icon");
    //     if (oldIcon) {
    //       oldIcon.parentElement!.removeChild(oldIcon);
    //     }

    //     icon = document.createElement(`ph-${recordIcon.id}`);
    //     icon.className = "cue-icon";
    //     icon.setAttribute("weight", "fill");
    //     const i = this.elements.get("icon")!;
    //     i.prepend(icon);
    //   }
    //   if (recordIcon.color && recordIcon.color !== "none") {
    //     icon.setAttribute("color", `rgb(var(--scheme-${recordIcon.color}))`);
    //   } else {
    //     icon.removeAttribute("color");
    //   }
    // } else {
    //   const iconElem = this.querySelector(".cue-icon");
    //   if (iconElem) {
    //     iconElem.parentElement!.removeChild(iconElem);
    //   }
    // }
  }

  protected onStateChange(curr: T): void {
    console.log("s", curr);
    this.mutateMessage(curr.message);
    this.mutateBackground(curr.background);
    this.mutateIcon(curr.icon);
    this.className = curr.type;
  }
}
