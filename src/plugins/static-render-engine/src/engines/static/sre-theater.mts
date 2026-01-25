import type { RenderNodeCssSpec } from "@dqm/package-dqm-api-v2";
import style from "./theater.component.css?inline";

const sheet = new CSSStyleSheet();
sheet.replaceSync(style);

export class DqmSreTheater extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  setTheater(t: HTMLElement) {
    this.shadowRoot!.replaceChildren(t);
  }

  setStyle(styles: RenderNodeCssSpec) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles.css);
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      sheet,
    ];
  }
}

export const defineSreTheater = () => {
  customElements.define("dqm-sre-theater", DqmSreTheater);
};
