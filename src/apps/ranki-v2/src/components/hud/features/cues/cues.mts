import type { HudCuesProps } from "../../hud.types.mts";
import styles from "./cues.component.css?inline";

const NAME = "ranki-hud-cues";
type Props = HudCuesProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudCues extends HTMLElement {
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

    this.p.forEach((c) => {
      const cue = document.createElement("div");
      cue.innerText = c.message;
      cue.classList.add("cue", `issuer-${c.issuer}`, `kind-${c.kind}`);
      container.appendChild(cue);
    });

    return container;
  }

  render() {
    if (this.p.length) {
      this.shadowRoot!.replaceChildren(this.build());
    } else {
      this.remove();
    }
  }
}

customElements.define(NAME, HudCues);

export function hudCues(props: Props, attach: HTMLElement) {
  let el: HudCues | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudCues;
    attach.appendChild(el);
    el.props = props;
  }

  return el;
}
