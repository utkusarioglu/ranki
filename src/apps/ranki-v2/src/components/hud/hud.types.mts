import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiRawTag,
  RankiTag,
} from "../../config/collect/collect.types.mts";
import type {
  CueRecord,
  RankiAddressTokens,
} from "../../config/config.types.mts";

export type HudComponentNames = "parser" | "address" | "tags" | "cues" | "card";

export type HudVisibility = "visible" | "pull" | "pullWhenShort";

/**
 * @dev
 * #1 This cannot be AnkiDeck as now it also includes separator, trim and hide tokens
 */
export type HudAddressSegment =
  | HudAddressSegmentBare
  | HudAddressSegmentWithParts;

export interface HudAddressSegmentPart {
  mode: "hide" | "trim";
  shown: string; // #1
  masked: string;
}
export interface HudAddressSegmentBare {
  mode: "show" | "separator";
  shown: string[];
}
/**
 * @dev
 * #1 Stores parts that are hidden by trim and hide modes.
 * When the user expands the list, hide modes can expand to show what they have
 * been hiding because of this shape. shown[] element indices should correspond
 * to the parts given.
 */
export interface HudAddressSegmentWithParts {
  mode: "hide" | "trim";
  shown: string[];
  parts: HudAddressSegmentPart[]; // #1
}

export interface HudAddressProps {
  tokens: RankiAddressTokens;
  segments: HudAddressSegment[];
}

export interface HudProps {
  order: HudComponentNames[];
  visibility: HudVisibility;
  parser: {
    hasReplacements: boolean;
    parseMode: "v1" | "v2" | "ignored";
    errorLevel: "none" | "warning" | "error";
  };
  address: HudAddressProps;
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
