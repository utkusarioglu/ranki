import type { WrappedState } from "_components/subtree/subtree.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";

export interface RTextProps {
  text: string;
  color?: string;
}

const DUR = 4e2;

export class RText extends Wc<RTextProps> {
  public static tag = "r-text";

  isActive(): boolean {
    const text = this.state.curr()?.text;
    return !!text && text.length > 0 && text !== "none";
  }

  canReconcile(s: WrappedState<RTextProps>): ReconciliationAction {
    if (s.type !== "text") {
      return "remove";
    } else if (!s.state.text || s.state.text === "none") {
      return "mutate";
    } else {
      return "mutate";
    }
  }

  setProps(c: RTextProps) {
    this.state.set(c);
  }

  initialize(): void {
    this.state.setTrigger((p, c) => p?.text !== c.text);
    this.css.set({
      overflow: "hidden",
      display: "inline-grid",
      "white-space": "nowrap",
    });
    this.animation
      .registerEventCallback("width", ({ keyframe }) => ({
        keyframes: [
          {
            width: this.getBoundingClientRect().width + "px",
          },
          {
            width: keyframe.width,
          },
        ],
        options: {
          duration: DUR,
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
          duration: DUR,
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
          duration: DUR,
        },
      }));
  }

  async onStateChange(curr: RTextProps) {
    this.elements.move("curr", "prev");
    const newText = RTextSpan.create.instance(curr, this);
    this.elements.push("curr", newText);
    this.animation.pushDependency("width", newText);
    this.elements.remove("prev");
    this.animation.triggerEvent("width", () => ({
      width: newText.css.getWidth() + "px",
      paddingLeft: "0px",
      paddingRight: "0px",
      marginLeft: "0px",
      marginRight: "0px",
      borderLeftWidth: "0px",
      borderRightWidth: "0px",
    }));
  }
}

export class RTextSpan extends Wc<RTextProps> {
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
          duration: DUR,
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
          duration: DUR,
          fill: "both",
        },
      }));
  }

  onStateChange(curr: RTextProps) {
    this.innerText = curr.text;
    if (curr.color) {
      this.css.set({ color: `rgb(var(--scheme-${curr.color}))` });
    } else {
      this.css.remove(["color"]);
    }
  }
}
