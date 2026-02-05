import { Wc } from "_components/wc/wc.mjs";

export interface RankiTextState {
  text: string;
}

export class RText extends Wc<RankiTextState> {
  public static tag = "r-text";

  initialize(): void {
    this.state.setTrigger((p, c) => p?.text !== c.text);
    this.css.set({
      overflow: "hidden",
      display: "inline-grid",
      "white-space": "nowrap",
    });
    this.animation
      .setDependencyCallback(() => this.elements.getList("prev", "curr"))
      .listenEvent("width", (endState: Keyframe) => ({
        keyframes: [
          {
            width: this.getBoundingClientRect().width + "px",
          },
          {
            width: endState.width,
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("enter", () => ({
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
        options: {
          duration: 2e3,
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        options: {
          duration: 2e3,
        },
      }));
  }

  async onStateChange(curr: RankiTextState) {
    this.elements.move("curr", "prev");
    const newText = RTextSpan.create.instance(curr.text, this);
    this.elements.push("curr", newText);
    this.elements.remove("prev");
    this.animation.triggerEvent("width", () => ({
      width: newText.css.getWidth() + "px",
    }));
  }
}

export class RTextSpan extends Wc<string> {
  public static tag = "r-text-span";

  initialize() {
    this.css.set({
      "grid-area": "1/1",
      width: "max-content",
    });
    this.animation
      .pushPreset("enter", () => ({
        keyframes: [
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ],
        options: {
          duration: 4e2,
          fill: "both",
        },
      }));
  }

  onStateChange(curr: string) {
    this.innerText = curr;
  }
}
