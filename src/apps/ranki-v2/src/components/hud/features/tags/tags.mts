import type { HudTagsProps } from "../../hud.types.mts";
import styles from "./tags.component.css?inline";

const NAME = "ranki-hud-tags";
type Props = HudTagsProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudTags extends HTMLElement {
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

    this.p.neutral.forEach((t) => {
      const tag = document.createElement("div");
      tag.classList.add("neutral");
      tag.innerText = t;
      container.appendChild(tag);
    });

    if (this.p.hideRanki) {
      this.p.ranki.forEach((t) => {
        const tag = document.createElement("div");
        tag.classList.add("ranki");
        tag.innerText = t;
        container.appendChild(tag);
      });
    }

    return container;
  }

  render() {
    if (this.p.count > 0) {
      this.shadowRoot!.replaceChildren(this.build());
    }
  }
}

customElements.define(NAME, HudTags);

export function hudTags(props: Props, attach: HTMLElement) {
  let el: HudTags | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudTags;
    el.props = props;
    attach.appendChild(el);
  }

  return el;
}
