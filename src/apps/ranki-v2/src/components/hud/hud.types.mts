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
  RankiAnimation,
} from "_config/config.types.mts";

export type HudComponentNames =
  | "notify"
  | "address"
  | "tags"
  | "cues"
  | "template";

export type HudVisibility = "visible" | "pull" | "pullWhenShort";

export interface HudAddressSegment {
  type: "divider" | "segment";
  position: {
    left: "first" | "local-first" | "middle";
    right: "last" | "local-last" | "middle";
  };
  mode: "show" | "separator" | "hide" | "trim" | "drop";
  shown: string[];
  masked: string[];
}

export interface HudAddressProps extends HudElementCommon {
  tokens: RankiAddressTokens;
  segments: HudAddressSegment[];
}

export interface HudTemplateProps extends HudElementCommon {
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
    notify: HudAppProps;
    address: HudAddressProps;
    tags: HudTagsProps;
    cues: ProcessedCueMapHud;
    template: HudTemplateProps;
  };
  animation: RankiHudStateAnimation;
}

export type RankiHudStateAnimation = RankiAnimation["hud"];
