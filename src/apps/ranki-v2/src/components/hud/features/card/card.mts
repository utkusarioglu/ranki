import { HudShadowBase } from "../../hud-base.mts";
import type { HudCardProps } from "../../hud.types.mts";
import styles from "./card.component.css?inline";

type Props = HudCardProps;

export class HudCard extends HudShadowBase<Props> {
  private static name = "ranki-hud-card";
  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private animateEntry() {
    return new Promise<void>((r) => {
      this.addEventListener(
        "transitioned",
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

  private adjustWidth() {
    const container = this.shadowRoot!.querySelector(
      "div.face",
    ) as HTMLDivElement;
    if (!container) {
      return;
    }

    const right = container.getBoundingClientRect().right;
    const left = this.getLeft();
    this.setProperties({ width: right - left + "px" });
  }

  connectedCallback() {
    this.animateEntry();
  }

  private animateExit(): Promise<void> {
    return new Promise((r) => {
      this.addEventListener(
        "transitionend",
        () => {
          this.remove();
          r();
        },
        {
          once: true,
        },
      );
      const width = this.getWidth();
      this.setProperties({ width: width + "px" });
      this.twoRaf(() =>
        this.setProperties({
          width: 0,
          opacity: 0,
          "margin-right": 0,
        }),
      );
    });
  }

  exit() {
    this.animateExit();
  }

  private build() {
    const c = this.shadowRoot!.querySelector("div.container") as HTMLDivElement;
    if (c) {
      return c;
    }
    const container = document.createElement("div");
    container.classList.add("container");
    const props = this.getProps();

    const type = document.createElement("div");
    type.classList.add("type");
    type.innerText = props.type;
    container.appendChild(type);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerText = props.card;
    container.appendChild(card);

    const face = document.createElement("div");
    face.classList.add("face");
    face.innerText = props.face;
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

  render() {
    const container = this.build();
    const props = this.getProps();
    this.setType(container, props.type);
    this.setCard(container, props.card);
    this.setFace(container, props.face);
    this.adjustWidth();
  }
}
