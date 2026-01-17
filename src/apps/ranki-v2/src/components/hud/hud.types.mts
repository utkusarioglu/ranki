import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiRawTag,
  RankiTag,
} from "../../collect/collect.types.mjs";
import type { AnkiFlagColors } from "../../config/config.types.mts";

export type HudComponentNames =
  | "parser"
  | "address"
  | "tags"
  | "review"
  | "card";

export type HudVisibility = "visible" | "pull" | "pullWhenShort";

export interface HudProps {
  order: HudComponentNames[];
  visibility: HudVisibility;
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
  tags: {
    count: number;
    neutral: AnkiRawTag[];
    ranki: RankiTag[];
  };
  review: {
    marked: undefined | { message: string };
    flag: {
      type: `flag${number}`;
      color: AnkiFlagColors;
      message: string;
    };
  };
  card: {
    type: AnkiCardType;
    face: AnkiCardFace;
    card: AnkiCard;
  };
}
