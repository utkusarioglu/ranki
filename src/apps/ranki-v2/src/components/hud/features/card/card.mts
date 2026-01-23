import type { HudCardProps } from "../../hud.types.mts";
import styles from "./card.component.css?inline";

const NAME = "ranki-hud-card";
type Props = HudCardProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudCard extends HTMLElement {
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

    const type = document.createElement("div");
    type.classList.add("type");
    type.innerText = this.p.type;
    container.appendChild(type);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerText = this.p.card;
    container.appendChild(card);

    const face = document.createElement("div");
    face.classList.add("face");
    face.innerText = this.p.face;
    container.appendChild(face);

    // container.innerText = "hi";

    // this.p.segments.forEach((s) => {
    //   const seg = document.createElement("div");
    //   switch (s.mode) {
    //     case "trim":
    //     case "hide":
    //     case "separator":
    //       seg.classList.add("divider");
    //       break;
    //     case "show":
    //       seg.classList.add("segment");
    //       break;
    //     default:
    //       assertNever({
    //         why: "Unrecognized address segment mode",
    //         details: { segments: this.p.segments, segment: s },
    //       });
    //   }
    //   seg.innerText = s.shown.join("");
    //   container.appendChild(seg);
    // });
    return container;
  }

  render() {
    this.shadowRoot!.replaceChildren(this.build());
  }
}

customElements.define(NAME, HudCard);

export function hudCard(props: Props, attach: HTMLElement) {
  let el: HudCard | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudCard;
    el.props = props;
    attach.appendChild(el);
  }

  return el;
}
