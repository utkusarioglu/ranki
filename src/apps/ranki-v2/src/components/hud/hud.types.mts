import type {
  AnkiCard,
  AnkiCardFace,
  AnkiCardType,
  AnkiRawTag,
  RankiTag,
} from "_collect/collect.types.mjs";
import type {
  ProcessedCueMapHud,
  RankiAddressTokens,
  RankiAnimation,
} from "_config/config.types.mjs";

export interface HudAddressProps extends HudElementCommon {
  animation: RankiHudStateAnimation;
  segments: HudAddressSegment[];
  tokens: RankiAddressTokens;
}

export interface HudAddressSegment {
  animation: {
    enabled: boolean;
  };
  masked: string[];
  mode: "drop" | "hide" | "separator" | "show" | "trim";
  position: {
    left: "first" | "local-first" | "middle";
    right: "last" | "local-last" | "middle";
  };
  shown: string[];
  type: "divider" | "segment";
}

export interface HudAppProps extends HudElementCommon {
  animation: RankiHudStateAnimation;
  errorLevel: "error" | "none" | "warning";
  hasReplacements: boolean;
  parseMode: "ignored" | "v1" | "v2";
}

export type HudComponentNames =
  | "address"
  | "cues"
  | "notify"
  | "tags"
  | "template";

export interface HudElementCommon {
  count: number;
}

export interface HudTagListItem {
  animation: {
    enabled: boolean;
  };
  text: AnkiRawTag | RankiTag;
  type: "anki" | "ranki";
}

export interface HudTagsProps extends HudElementCommon {
  animation: RankiHudStateAnimation;
  hideRanki: boolean;
  list: HudTagListItem[];
  neutral: AnkiRawTag[];
  ranki: RankiTag[];
}

export interface HudTemplateProps extends HudElementCommon {
  animation: RankiHudStateAnimation;
  card: AnkiCard;
  face: AnkiCardFace;
  type: AnkiCardType;
}

export type HudVisibility = "pull" | "pullWhenShort" | "visible";

export interface RankiHudState {
  animation: RankiHudStateAnimation;
  order: HudComponentNames[];
  subtree: {
    address: HudAddressProps;
    cues: ProcessedCueMapHud;
    notify: HudAppProps;
    tags: HudTagsProps;
    template: HudTemplateProps;
  };
  visibility: HudVisibility;
}

export type RankiHudStateAnimation = RankiAnimation["hud"];
