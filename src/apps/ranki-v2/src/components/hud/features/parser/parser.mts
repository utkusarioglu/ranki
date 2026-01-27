import { HudShadowBase, type AnimationTypes } from "../../hud-base.mts";
import type { HudParserProps } from "../../hud.types.mts";
import styles from "./parser.component.css?inline";

type Props = HudParserProps;

export class HudParser extends HudShadowBase<Props> {
  protected static name = "ranki-hud-parser" as const;
  protected animations: AnimationTypes = {
    enter: this.animateEntry.bind(this),
    exit: this.animateExit.bind(this),
  };

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.replacements",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }

    const right = container.getBoundingClientRect().right;
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  private animateEntry() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          r();
        },
        { once: true },
      );
      this.setProperties({ opacity: 0, width: 0 });
      this.twoRaf(() => {
        this.setProperties({ opacity: 1 });
        this.adjustWidth();
      });
    });
  }

  private animateExit() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          this.remove();
          r();
        },
        { once: true },
      );
      const width = this.getWidth();
      this.setProperties({ width: width + "px" });
      this.twoRaf(() => {
        this.setProperties({ width: 0, opacity: 0, "margin-right": 0 });
      });
    });
  }

  private build() {
    let container = this.shadowRoot!.querySelector("div.container");
    if (container) {
      return container;
    }
    const props = this.getProps();
    container = document.createElement("div");
    this.shadowRoot!.replaceChildren(container);
    container.classList.add("container");
    container.classList.add(`error-${props.errorLevel}`);

    const version = document.createElement("div");
    version.classList.add("version");
    version.innerText = props.parseMode;
    container.appendChild(version);

    if (props.hasReplacements) {
      const replacements = document.createElement("div");
      replacements.classList.add("replacements");
      replacements.innerText = "Δ";
      container.appendChild(replacements);
    }

    return container;
  }

  render() {
    this.build();
  }
}
