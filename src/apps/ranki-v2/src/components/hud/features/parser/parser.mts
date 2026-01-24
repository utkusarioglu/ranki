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

  private build() {
    const container = document.createElement("div");
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
    this.shadowRoot!.replaceChildren(this.build());
  }
}

customElements.define(NAME, HudParser);

export function hudParser(props: Props, attach: HTMLElement) {
  let el: HudParser | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudParser;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
