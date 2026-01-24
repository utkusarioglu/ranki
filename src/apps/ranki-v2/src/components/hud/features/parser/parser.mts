import type { HudParserProps } from "../../hud.types.mts";
import styles from "./parser.component.css?inline";

const NAME = "ranki-hud-parser";
type Props = HudParserProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudParser extends HTMLElement {
  private p!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: Props) {
    this.p = props;
    this.render();
  }

  // SAME
  connectedCallback() {
    this.style.setProperty("opacity", "0");
    this.style.setProperty("width", "0");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.style.setProperty("opacity", "1");
        this.adjustWidth();
      });
    });
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
    this.style.setProperty("width", right - left + "px");
  }

  private getLeft() {
    return this.getBoundingClientRect().left;
  }

  // SAME
  exit() {
    const width = this.getBoundingClientRect().width;
    this.style.setProperty("width", width + "px");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // this.drain();
        this.style.setProperty("width", "0px");
        this.style.setProperty("opacity", "0");
        this.style.setProperty("margin-right", "0");
        this.addEventListener("transitionend", () => this.remove(), {
          once: true,
        });
      });
    });
  }

  private build() {
    let container = this.shadowRoot!.querySelector("div.container");
    if (container) {
      return container;
    }
    container = document.createElement("div");
    this.shadowRoot!.replaceChildren(container);
    container.classList.add("container");
    container.classList.add(`error-${this.p.errorLevel}`);

    const version = document.createElement("div");
    version.classList.add("version");
    version.innerText = this.p.parseMode;
    container.appendChild(version);

    if (this.p.hasReplacements) {
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

customElements.define(NAME, HudParser);

export function hudParser(props: Props, attach: HTMLElement) {
  let el: HudParser | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudParser;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
