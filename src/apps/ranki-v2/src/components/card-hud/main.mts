import css from "./main.css?raw";
import { createParserFeature } from "./features/parser.mjs";
import { createHudContainer } from "./features/container.mjs";
import { createReviewFeature } from "./features/review.mjs";
import { createAddressFeature } from "./features/address.mjs";
import { createCardFeature } from "./features/card.mjs";
import { createTagsFeature } from "./features/tags.mjs";
import horizontalScrollerCss from "./scroller.css?raw";
import hudCss from "./container.css?raw";
import type { RankiRenderNode } from "../../types/render-node.mts";

export type HudComponentNames =
  | "parser"
  | "address"
  | "tags"
  | "review"
  | "card";

export interface HudProps {
  order: HudComponentNames[];
  parser: {
    hasReplacements: boolean;
    parseMode: "v1" | "v2" | "ignored";
    errorLevel: "none" | "warning" | "error";
  };

  address: {
    prefix: string[];
    exposed: string[];
    suffix: string[];
  };
  tags: string[];
  review: {
    marked: boolean;
    flag: {
      type: `flag${number}`;
      message: string;
    };
  };
  card: {
    type: string;
    face: string;
  };
}

//
export function cardHud(props: HudProps): RankiRenderNode {
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
        id: "anki-hud",
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
