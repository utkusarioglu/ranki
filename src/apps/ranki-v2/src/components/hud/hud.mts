import { createParserFeature } from "./features/parser.mjs";
import { createHudContainer } from "./features/container.mjs";
import { createCuesFeature } from "./features/review.mjs";
// import { createAddressFeature } from "./features/address.mjs";
// import { createCardFeature } from "./features/card.mjs";
import { createTagsFeature } from "./features/tags.mjs";
import type { RankiComponent } from "../../types/ranki-component.types.mjs";
import type { HudProps } from "./hud.types.mjs";
import "./hud-scroller.css";
import "./hud-item.css";
import "./container.css";
import { assertNever } from "../../error/assertions.mts";
import { hudAddress } from "./features/address/address.mts";
import { hudCard } from "./features/card/card.mts";
import { hudParser } from "./features/parser/parser.mts";

export function createHud(props: HudProps): RankiComponent {
  const { element, refs } = createHudContainer(props);
  const scroller = refs!["scroller"];
  scroller.classList.add("hud-scroller");
  props.order.forEach((p) => {
    switch (p) {
      case "address":
        // createAddressFeature(props, scroller);
        hudAddress(props.address, scroller);
        break;
      case "card":
        hudCard(props.card, scroller);
        // createCardFeature(props, scroller);
        break;
      case "cues":
        createCuesFeature(props, scroller);
        break;
      case "parser":
        // createParserFeature(props, scroller);
        hudParser(props.parser, scroller);
        break;
      case "tags":
        createTagsFeature(props, scroller);
        break;
      default:
        assertNever({
          why: "Given property is not a valid hud component",
          details: { p },
        });
    }
  });

  return {
    element,
  };
}
