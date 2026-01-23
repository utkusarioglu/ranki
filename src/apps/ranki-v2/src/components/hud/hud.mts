import { createHudContainer } from "./features/container.mjs";
import { createCuesFeature } from "./features/review.mjs";
import type { RankiComponent } from "../../types/ranki-component.types.mjs";
import type { HudProps } from "./hud.types.mjs";
import "./hud-scroller.css";
import "./hud-item.css";
import "./container.css";
import { assertNever } from "../../error/assertions.mts";
import { hudAddress } from "./features/address/address.mts";
import { hudCard } from "./features/card/card.mts";
import { hudParser } from "./features/parser/parser.mts";
import { hudTags } from "./features/tags/tags.mts";
import { hudCues } from "./features/cues/cues.mts";

export function createHud(props: HudProps): RankiComponent {
  const { element, refs } = createHudContainer(props);
  const scroller = refs!["scroller"];
  scroller.classList.add("hud-scroller");
  props.order.forEach((p) => {
    switch (p) {
      case "address":
        hudAddress(props.address, scroller);
        break;
      case "card":
        hudCard(props.card, scroller);
        break;
      case "cues":
        hudCues(props.cues, scroller);
        break;
      case "parser":
        hudParser(props.parser, scroller);
        break;
      case "tags":
        hudTags(props.tags, scroller);
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
