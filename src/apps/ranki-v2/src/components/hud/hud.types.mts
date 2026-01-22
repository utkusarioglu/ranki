import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiDeck,
  AnkiRawTag,
  RankiTag,
} from "../../config/collect/collect.types.mts";
import type { CueRecord } from "../../config/config.types.mts";

export type HudComponentNames = "parser" | "address" | "tags" | "cues" | "card";

export type HudVisibility = "visible" | "pull" | "pullWhenShort";

export interface HudAddressSegment {
  mode: "hide" | "show" | "trim";
  text: AnkiDeck;
}

export interface HudProps {
  order: HudComponentNames[];
  visibility: HudVisibility;
  parser: {
    hasReplacements: boolean;
    parseMode: "v1" | "v2" | "ignored";
    errorLevel: "none" | "warning" | "error";
  };
  address: {
    segments: HudAddressSegment[];
  };
  tags: {
    count: number;
    neutral: AnkiRawTag[];
    ranki: RankiTag[];
    hideRanki: boolean;
  };
  cues: CueRecord[];
  card: {
    type: AnkiCardType;
    face: AnkiCardFace;
    card: AnkiCard;
  };
}
