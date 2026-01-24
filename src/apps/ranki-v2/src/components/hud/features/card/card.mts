import type { HudCardProps } from "../../hud.types.mts";
import styles from "./card.component.css?inline";

const NAME = "ranki-hud-card";
type Props = HudCardProps;

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class HudCard extends HTMLElement {
  private curr!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(props: Props) {
    this.curr = props;
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
    const c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    const container = document.createElement("div");
    container.classList.add("container");

    const type = document.createElement("div");
    type.classList.add("type");
    type.innerText = this.curr.type;
    container.appendChild(type);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerText = this.curr.card;
    container.appendChild(card);

    const face = document.createElement("div");
    face.classList.add("face");
    face.innerText = this.curr.face;
    container.appendChild(face);

    this.shadowRoot!.replaceChildren(container);
    return container;
  }

  private setType(c: HTMLDivElement, type: string) {
    const e = c.querySelector(".type") as HTMLDivElement;
    e.innerText = type;
  }

  private setCard(c: HTMLDivElement, card: string) {
    const e = c.querySelector(".card") as HTMLDivElement;
    e.innerText = card;
  }

  private setFace(c: HTMLDivElement, face: string) {
    const e = c.querySelector(".face") as HTMLDivElement;
    e.innerText = face;
  }

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.face",
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

  render() {
    const container = this.build();
    // requestAnimationFrame(() => {
    this.setType(container, this.curr.type);
    this.setCard(container, this.curr.card);
    this.setFace(container, this.curr.face);
    // requestAnimationFrame(() => {
    //   requestAnimationFrame(() => {
    this.adjustWidth();
    //   });
    // });
    // });
  }
}

export const hudCardDefine = () => customElements.define(NAME, HudCard);

export function hudCard(props: Props, attach: HTMLElement) {
  let el: HudCard | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as HudCard;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
