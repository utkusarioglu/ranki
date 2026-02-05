import { Wc } from "_components/wc/wc.mjs";

export interface RankiTextState {
  text: string;
}

export class Text extends Wc<RankiTextState> {
  public static tag = "r-text";

  initialize(): void {
    this.state.setFilter((p, c) => p?.text !== c.text);
    this.animation.setDependencyCb(() => this.elements.getList("prev", "curr"));
    this.css.set({
      overflow: "hidden",
      display: "grid",
      "background-color": "gray",
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
    const newText = TextSpan.create.instance(curr.text, this);

    this.animation.onLayout({
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

export class TextSpan extends Wc<string> {
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
