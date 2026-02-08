import { horizontalScrollUtil } from "_components/scroller/horizontal.mts";
import { assertNever, assertNotNull } from "_error/assertions.mts";
import { HudCard } from "./features/card/card.mts";
import { HudTags } from "./features/tags/tags.mts";
import { RankiHudWc, type SingletonContainer } from "./hud-wc/hud-wc.mts";
import styles from "./hud.component.css?inline";
import type {
  HudAddressProps,
  HudCardProps,
  HudComponentNames,
  HudAppProps,
  HudTagsProps,
  RankiHudState,
} from "./hud.types.mjs";
import type { RankiWc } from "_components/ranki-wc/ranki-wc.mjs";
import { Subtree } from "_components/subtree/subtree.mjs";
import type { ProcessedCueMapHud } from "_config/config.types.mjs";
import { RAddress } from "./features/address/address.mts";
import { RNotify } from "./features/notify/notify.mts";
import { RCues } from "./features/cues/cues.mts";

interface Wrapped {
  type: HudComponentNames;
  state: ChildState;
}

type ChildState =
  | HudAppProps
  | HudAddressProps
  | HudTagsProps
  | ProcessedCueMapHud
  | HudCardProps;

export class RankiHud extends RankiHudWc<RankiHudState> {
  protected static name = "ranki-hud" as const;
  private subtree = new Subtree<RankiWc<ChildState>, ChildState>({
    create: this.createSubtreeChild.bind(this),
    remove: this.removeSubtreeChild.bind(this),
  });

  constructor() {
    super(true);
    this.pushStyles(styles);
  }

  private getScroller() {
    return this.getContainer()!.querySelector(
      ".scroll-scroller",
    ) as HTMLElement;
  }

  protected createSingletonContainer(
    classes: string[] = [],
  ): SingletonContainer {
    let container = this.shadowRoot!.querySelector(
      "div.container",
    ) as HTMLDivElement;
    if (container) {
      return [container, true];
    }
    container = document.createElement("div");
    container.classList.add("container", ...classes);
    const center = document.createElement("div");
    center.classList.add("center");
    container.append(center);
    const scroller = horizontalScrollUtil();
    scroller.tail.classList.add("content");
    center.appendChild(scroller.head);
    this.shadowRoot!.adoptedStyleSheets.push(scroller.sheet);
    this.shadowRoot!.replaceChildren(container);
    return [container, false];
  }

  private createSubtreeChild(state: Wrapped) {
    const scroller = this.getScroller();
    assertNotNull(scroller, { why: "No container" });
    switch (state.type) {
      case "notify":
        return RNotify.create.instance(state.state, scroller);
      case "address":
        return RAddress.create.instance(state.state, scroller);
      case "cues":
        return RCues.create.instance(state.state, scroller);
      case "card":
        return HudCard.singleton(state.state, scroller);
      case "tags":
        return HudTags.singleton(state.state, scroller);
      default:
        assertNever({
          why: "Given property is not a valid hud component",
          details: { state },
        });
    }
  }

  private removeSubtreeChild(e: RankiWc<ChildState>) {
    e.remove();
  }

  private build() {
    this.createSingletonContainer();
  }

  render() {
    this.build();
    const curr = this.getCurr();
    const subtreeState = curr.order.map((type) => {
      return {
        type,
        state: curr.subtree[type],
      };
    });
    this.subtree.reconcile(subtreeState);
    return this;
  }
}
