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
  private curr!: Props;
  private prev: Props | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [sheet];
  }

  set props(p: Props) {
    this.prev = this.curr;
    this.curr = p;
    this.render();
  }

  connectedCallback() {
    console.log("connected hud", this);
    // if (!this.shadowRoot) {
    //   this.attachShadow({ mode: "open" });
    // }

    // if (!this._container?.isConnected) {
    //   this.shadowRoot.append(this.container());
    // }
  }

  private container() {
    const c = this.shadowRoot!.querySelector("div.container");
    if (c) {
      console.log("hud reuse");
      const tail = c.querySelector(".scroll-scroller") as HTMLElement;
      return { head: c, tail };
    }
    const container = document.createElement("div");
    container.classList.add("container");
    const center = document.createElement("div");
    center.classList.add("center");
    container.append(center);
    const scroller = horizontalScrollUtil();
    scroller.tail.classList.add("content");
    center.appendChild(scroller.head);
    this.shadowRoot!.adoptedStyleSheets.push(scroller.sheet);
    this.shadowRoot!.replaceChildren(container);
    return { head: container, tail: scroller.tail };
  }

  private build() {
    const { head, tail } = this.container();
    this.curr.order.forEach((p) => {
      switch (p) {
        case "address":
          console.log("hud address");
          hudAddress(this.curr.address, tail);
          break;
        // case "card":
        //   hudCard(this.curr.card, tail);
        //   break;
        // case "cues":
        //   hudCues(this.curr.cues, tail);
        //   break;
        // case "parser":
        //   hudParser(this.curr.parser, tail);
        //   break;
        // case "tags":
        //   hudTags(this.curr.tags, tail);
        //   break;
        // default:
        //   assertNever({
        //     why: "Given property is not a valid hud component",
        //     details: { p },
        //   });
      }
    });
    return head;
  }

  render() {
    this.build();
    // this.shadowRoot!.replaceChildren(this.build());
  }
}

export const hudDefine = () => customElements.define(NAME, Hud);

export function hud(props: Props, attach: HTMLElement) {
  let el: Hud | null = attach.querySelector(NAME);

  if (!el) {
    el = document.createElement(NAME) as Hud;
    attach.appendChild(el);
  }
  el.props = props;

  return el;
}
