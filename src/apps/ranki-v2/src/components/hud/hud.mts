import type { HudProps } from "./hud.types.mjs";
import { assertNever } from "../../error/assertions.mts";
import { HudAddress } from "./features/address/address.mts";
import { HudCard } from "./features/card/card.mts";
import { HudParser } from "./features/parser/parser.mts";
import { HudTags } from "./features/tags/tags.mts";
import { HudCues } from "./features/cues/cues.mts";
import styles from "./hud.component.css?inline";
import { horizontalScrollUtil } from "../scroller/horizontal.mts";
import { RankiHudWc } from "./hud-wc/hud-wc.mts";

export class Hud extends RankiHudWc<HudProps> {
  protected static name = "ranki-hud" as const;

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private container() {
    const c = this.shadowRoot!.querySelector("div.container");
    if (c) {
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
    const props = this.getCurr();
    props.order.forEach((p) => {
      switch (p) {
        case "address":
          HudAddress.singleton(props.address, tail);
          break;
        case "card":
          HudCard.singleton(props.card, tail);
          break;
        case "cues":
          HudCues.singleton(props.cues, tail);
          break;
        case "parser":
          HudParser.singleton(props.parser, tail);
          break;
        case "tags":
          HudTags.singleton(props.tags, tail);
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
    this.build();
  }
}
