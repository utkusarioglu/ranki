import type { HudProps } from "./hud.types.mjs";
import { assertNever } from "../../error/assertions.mts";
import { hudAddress } from "./features/address/address.mts";
import { hudCard } from "./features/card/card.mts";
import { hudParser } from "./features/parser/parser.mts";
import { hudTags } from "./features/tags/tags.mts";
import { hudCues } from "./features/cues/cues.mts";
import styles from "./hud.component.css?inline";
import { horizontalScrollUtil } from "../scroller/horizontal.mts";

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const NAME = "ranki-hud";
type Props = HudProps;

class Hud extends HTMLElement {
  private p!: Props;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(p: Props) {
    this.p = p;
    this.render();
  }

  private container() {
    const container = document.createElement("div");
    container.classList.add("container");
    const center = document.createElement("div");
    center.classList.add("center");
    container.append(center);
    const scroller = horizontalScrollUtil();
    scroller.tail.classList.add("content");
    center.appendChild(scroller.head);
    this.shadowRoot!.adoptedStyleSheets.push(scroller.sheet);
    return { head: container, tail: scroller.tail };
  }

  private build() {
    const { head, tail } = this.container();
    this.p.order.forEach((p) => {
      switch (p) {
        case "address":
          hudAddress(this.p.address, tail);
          break;
        case "card":
          hudCard(this.p.card, tail);
          break;
        case "cues":
          hudCues(this.p.cues, tail);
          break;
        case "parser":
          hudParser(this.p.parser, tail);
          break;
        case "tags":
          hudTags(this.p.tags, tail);
          break;
        default:
          assertNever({
            why: "Given property is not a valid hud component",
            details: { p },
          });
      }
    });
    return head;
  }

  render() {
    this.shadowRoot!.replaceChildren(this.build());
  }
}

customElements.define(NAME, Hud);

export function hud(props: Props, attach: HTMLElement) {
  let el: Hud | null = document.body.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as Hud;
    attach.appendChild(el);
    el.props = props;
  }

  return el;
}
