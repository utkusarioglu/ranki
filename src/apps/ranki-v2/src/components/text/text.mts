import { Wc } from "_components/wc/wc.mjs";

export interface RankiTextState {
  text: string;
}

export class RText extends Wc<RankiTextState> {
  public static tag = "r-text";

  initialize(): void {
    this.state.setTrigger((p, c) => p?.text !== c.text);
    this.animation.setDependencyCb(() => this.elements.getList("prev", "curr"));
    this.css.set({
      overflow: "hidden",
      display: "inline-grid",
      "white-space": "nowrap",
    });
    this.animation.setEventLibrary({
      enter: {
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
      },
      exit: {
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
      },
    });
  }

  async onStateChange(curr: RankiTextState) {
    this.elements.move("curr", "prev");
    const newText = RTextSpan.create.instance(curr.text, this);

    this.animation.onLayout("width", {
      keyframes: [
        {
          width: this.getBoundingClientRect().width + "px",
        },
        {
          width: () => newText.css.getWidth() + "px",
        },
      ],
      options: {
        duration: 4e2,
        fill: "both",
      },
    });

    this.elements.push("curr", newText);
    this.elements.remove("prev");
  }
}

export class RTextSpan extends Wc<string> {
  public static tag = "r-text-span";

  initialize() {
    this.css.set({
      "grid-area": "1/1",
      width: "max-content",
    });
    this.animation.setEventLibrary({
      enter: {
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
      },
      exit: {
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
      },
    });
  }

  onStateChange(curr: string) {
    this.innerText = curr;
  }
}
