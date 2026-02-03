import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiRawTag,
  RankiTag,
} from "_config/collect/collect.types.mts";
import type {
  ProcessedCueMapHud,
  RankiAddressTokens,
} from "_config/config.types.mts";

export type HudComponentNames = "app" | "address" | "tags" | "cues" | "card";

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

export interface HudAddressProps extends HudElementCommon {
  tokens: RankiAddressTokens;
  segments: HudAddressSegment[];
}

export interface HudCardProps extends HudElementCommon {
  type: AnkiCardType;
  face: AnkiCardFace;
  card: AnkiCard;
}

export interface HudElementCommon {
  count: number;
}

export interface HudAppProps extends HudElementCommon {
  hasReplacements: boolean;
  parseMode: "v1" | "v2" | "ignored";
  errorLevel: "none" | "warning" | "error";
}

export interface HudTagListItem {
  type: "ranki" | "anki";
  text: AnkiRawTag | RankiTag;
}

export interface HudTagsProps extends HudElementCommon {
  list: HudTagListItem[];
  neutral: AnkiRawTag[];
  ranki: RankiTag[];
  hideRanki: boolean;
}

export interface RankiHudState {
  order: HudComponentNames[];
  visibility: HudVisibility;
  subtree: {
    app: HudAppProps;
    address: HudAddressProps;
    tags: HudTagsProps;
    cues: ProcessedCueMapHud;
    card: HudCardProps;
  };
}
