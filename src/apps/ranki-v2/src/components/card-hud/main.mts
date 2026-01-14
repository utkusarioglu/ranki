import css from "./main.css?raw";
import { createParserFeature } from "./features/parser.mjs";
import { createHudContainer } from "./features/container.mjs";
import { createReviewFeature } from "./features/review.mjs";
import { createAddressFeature } from "./features/address.mjs";
import { createCardFeature } from "./features/card.mjs";
import { createTagsFeature } from "./features/tags.mjs";
import horizontalScrollerCss from "./scroller.css?raw";
import hudCss from "./container.css?raw";
import type { RankiComponent } from "../../types/ranki-component.types.mjs";
import type { HudProps } from "./hud.types.mjs";

//
export function createHud(props: HudProps): RankiComponent {
  const { element, refs } = createHudContainer(props);
  const scroller = refs!["scroller"];
  props.order.forEach((p) => {
    switch (p) {
      case "address":
        createAddressFeature(props, scroller);
        break;
      case "card":
        createCardFeature(props, scroller);
        break;
      case "review":
        createReviewFeature(props, scroller);
        break;
      case "parser":
        createParserFeature(props, scroller);
        break;
      case "tags":
        createTagsFeature(props, scroller);
        break;
      default:
        throw new Error(`unrecognized feature: ${p}: REPLACE THIS ERROR`);
    }
  });

  return {
    element,
    css: [
      {
        id: "ranki-hud",
        css,
      },
      {
        id: "ranki-horizontal-scroller",
        css: horizontalScrollerCss,
      },
      {
        id: "ranki-hud-container",
        css: hudCss,
      },
    ],
  };
}
