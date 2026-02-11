import type { WrappedState } from "_components/wc/sub.mjs";
import { Wc, type ReconciliationAction } from "_components/wc/wc.mjs";
import { Timing } from "_utils/timing.mjs";

export interface RTextProps {
  text: string;
  color?: string;
}

const DUR = 4e2;
const LEN = 2;

export class RText extends Wc<RTextProps> {
  public static tag = "r-text";
  private activeIndex = 0;

  isActive(): boolean {
    const text = this.state.curr()?.text;
    return !!text && text.length > 0 && text !== "none";
  }

  canReconcile(s: WrappedState<RTextProps>): ReconciliationAction {
    if (s.type !== "text") {
      return "remove";
    } else {
      return "mutate";
    }
  }

  setProps(c: RTextProps) {
    this.state.set(c);
  }

  initialize(): void {
    for (let i = 0; i < LEN; i++) {
      const el = RTextSpan.create.instance(null, this);
      this.elements.push(i.toString(), el);
    }
    this.state.setTrigger((p, c) => p?.text !== c.text || p?.color !== c.color);
    this.css.set({
      display: "inline-grid",
      "white-space": "nowrap",
      width: 0,
    });
    this.animation
      .pushPreset("enter", () => ({
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
      .pushPreset("exit", () => ({
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }));
  }

  private reportWidth() {
    const elem = this.elements.get<RTextSpan>(this.activeIndex.toString())!;
    this.animation.triggerEvent("width", () => {
      const currWidth = getComputedStyle(this).width;
      const elemWidth = elem.css.getWidth() + "px";

      this.animation.animate("own-width", {
        keyframes: [
          {
            width: currWidth,
          },
          {
            width: elemWidth,
          },
        ],
        options: {
          duration: DUR,
          fill: "both",
        },
      });

      return {
        ...this.css.zeroWidthProperties(),
        width: elemWidth,
        // marginRight: this.marginRight, // #1
      };
    });
  }

  protected async onStateSame(): Promise<void> {
    this.reportWidth();
  }

  async onStateChange(curr: RTextProps) {
    const hide = this.elements.get<RTextSpan>(this.activeIndex.toString())!;
    hide.animation.runPreset("hide");
    this.activeIndex = (this.activeIndex + 1) % LEN;
    const show = this.elements.get<RTextSpan>(this.activeIndex.toString())!;
    show.state.set(curr);
    show.animation.runPreset("show");
    this.reportWidth();
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
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
      .pushPreset("show", () => ({
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }))
      .pushPreset("hide", () => ({
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        options: {
          duration: DUR,
          fill: "both",
        },
      }));
  }

  async onStateChange(curr: RTextProps) {
    this.innerText = curr.text;

    // await Timing.waitLayout();
    if (curr.color) {
      this.css.set({ color: `rgb(var(--scheme-${curr.color}))` });
    } else {
      this.css.remove(["color"]);
    }
  }
}
