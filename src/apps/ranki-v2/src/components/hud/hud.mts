import { assertNever, assertNotNull } from "_error/assertions.mts";
import styles from "./hud.component.css?inline";
import type {
  HudAddressProps,
  HudTemplateProps,
  HudComponentNames,
  HudAppProps,
  HudTagsProps,
  RankiHudState,
} from "./hud.types.mjs";
import type { ProcessedCueMapHud } from "_config/config.types.mjs";
import { RAddress } from "./features/address/address.mts";
import { RNotify } from "./features/notify/notify.mts";
import { RCues } from "./features/cues/cues.mts";
import { RTemplate } from "./features/template/template.mts";
import { RTags } from "./features/tags/tags.mts";
import { WcHudContainer } from "./components/container.mts";

interface Wrapped {
  type: HudComponentNames;
  state: ChildState;
}

type ChildrenTypes = RAddress | RNotify | RCues | RTemplate | RTags;

type ChildState =
  | HudAppProps
  | HudAddressProps
  | HudTagsProps
  | ProcessedCueMapHud
  | HudTemplateProps;

export class RHud extends WcHudContainer<
  RankiHudState,
  RankiHudState,
  // @ts-expect-error
  ChildrenTypes,
  ChildState
> {
  public static readonly tag = "r-hud" as const;

  constructor() {
    super(true);
    this.css.pushStyles(styles);
  }

  initialize(): void {
    const container = this.elements.create("container", {
      tag: "div",
      classes: ["container"],
    });

    const center = this.elements.create(
      "center",
      {
        tag: "div",
        classes: ["center", "scroll-container"],
      },
      container,
    );
    this.elements.create(
      "scroller",
      {
        tag: "div",
        classes: ["scroller", "content"],
      },
      center,
    );
    this.animation.pushPreset("exit", () => ({
      keyframes: [
        {
          opacity: 1,
          // ...this.css.selectWidthProperties(getComputedStyle(this)),
        },
        {
          opacity: 0,
          // ...this.css.zeroWidthProperties(),
        },
      ],
      options: {
        duration: 200,
        fill: "both",
      },
    }));
  }

  protected createSubtreeChild(state: Wrapped) {
    const scroller = this.elements.get("scroller");
    assertNotNull(scroller, { why: "No container" });
    switch (state.type) {
      case "notify":
        return RNotify.create.instance(state.state, scroller);
      case "address":
        return RAddress.create.instance(state.state, scroller);
      case "cues":
        return RCues.create.instance(state.state, scroller);
      case "template":
        return RTemplate.create.instance(state.state, scroller);
      case "tags":
        return RTags.create.instance(state.state, scroller);
      default:
        assertNever({
          why: "Given property is not a valid hud component",
          details: { state },
        });
    }
  }

  protected onStateChange(curr: RankiHudState): void {
    const subtreeState = curr.order.map((type) => {
      return {
        type,
        state: curr.subtree[type],
      };
    });
    this.subtree.reconcile(subtreeState);
  }
}
