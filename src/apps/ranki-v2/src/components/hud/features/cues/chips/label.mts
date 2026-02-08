import { WcChip } from "_components/hud/components/chip.mjs";
import { RText } from "_components/text/text.mjs";
import type { CueRecord, ProcessedCue } from "_config/config.types.mjs";

type T = ProcessedCue;

export class RCueChip extends WcChip<T> {
  static readonly tag = "r-cue-chip";

  // initialize(): void {
  //   this.elements.create("icon", { tag: "div", classes: ["icon"] });
  //   super.initialize();
  // }

  private mutateMessage(message: CueRecord["message"]) {
    const text = this.elements.get<RText>("text")!;
    if (message && message.text) {
      if (message.color && message.color !== "none") {
        this.css.set({
          color: `rgb(var(--scheme-${message.color}))`,
        });
      } else {
        this.css.remove(["color"]);
      }
      text.state.set({ text: message.text });
    } else {
      text.state.set({ text: "" });
    }
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

  protected onStateChange(curr: T): void {
    this.mutateMessage(curr.message);
    this.mutateBackground(curr.background);
    // text.state.set({ text: curr.message!.text });
    this.className = curr.type;
  }
}
