import { horizontalScrollUtil } from "_components/scroller/horizontal.mts";
import { assertNever } from "_error/assertions.mts";
import { HudAddress } from "./features/address/address.mts";
import { HudCard } from "./features/card/card.mts";
import { HudApp } from "./features/app/app.mts";
import { HudTags } from "./features/tags/tags.mts";
import { RankiHudWc } from "./hud-wc/hud-wc.mts";
import styles from "./hud.component.css?inline";
import type {
  HudComponentNames,
  HudElementCommon,
  RankiHudState,
} from "./hud.types.mjs";
import { HudCues } from "./features/cues/cues.mts";
import type { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";

type SubtreeTypes = {
  element: RankiWc<any>;
  state: HudElementCommon;
};

export class RankiHud extends RankiHudWc<RankiHudState> {
  protected static name = "ranki-hud" as const;
  private subtree: SubtreeTypes[] = [];

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private createSingletonHudContainer() {
    let container = this.shadowRoot!.querySelector("div.container");
    if (container) {
      const tail = container.querySelector(".scroll-scroller") as HTMLElement;
      return { head: container, tail };
    }
    container = document.createElement("div");
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

  private createChild(
    type: HudComponentNames,
    state: RankiHudState,
    container: HTMLElement,
  ) {
    switch (type) {
      case "address":
        this.subtree.push({
          state: state.address,
          element: HudAddress.singleton(state.address, container),
        });
        break;
      case "card":
        this.subtree.push({
          state: state.card,
          element: HudCard.singleton(state.card, container),
        });
        break;
      case "cues":
        this.subtree.push({
          state: state.cues,
          element: HudCues.singleton(state.cues, container),
        });
        break;
      case "app":
        this.subtree.push({
          state: state.parser,
          element: HudApp.singleton(state.parser, container),
        });
        break;
      case "tags":
        this.subtree.push({
          state: state.tags,
          element: HudTags.singleton(state.tags, container),
        });
        break;
      default:
        assertNever({
          why: "Given property is not a valid hud component",
          details: { type },
        });
    }
  }

  private build() {
    const { head, tail } = this.createSingletonHudContainer();
    const curr = this.getCurr();
    curr.order.forEach((p) => {
      this.createChild(p, curr, tail);
    });
    return head;
  }

  private reconcile() {
    const hasNext = this.subtree
      .map((s) => s.element.isActive())
      .reverse()
      .map((c, i, a) => (c ? (a[i] = true) : (a[i] = a[i - 1] || false)))
      .reverse();
    this.subtree.forEach(({ element }, i) => {
      const val = element.isActive() && hasNext[i];
      element.setProperties({ "margin-right": val ? "1em" : 0 });
    });
  }

  render() {
    this.build();
    this.reconcile();
    return this;
  }
}
