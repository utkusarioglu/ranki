import type {
  DqmConfigPackPartial,
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";
import type {
  HudComponentNames,
  HudVisibility,
} from "../components/hud/hud.types.mjs";
import type { DeepPartialSerializable } from "../types/util.types.mjs";
import type { AnkiCardFace, CardFaceArray } from "../collect/collect.types.mts";
import type { HudProps } from "../components/hud/hud.types.mts";

export type Deck = string;

export type MatchTypes = "exact" | "glob" | "regex";

export type DeckSettings = DeckExactSettings &
  DeckGlobSettings &
  DeckRegexSettings;

export type DeckExactSettings = DeckCommonSettings & {
  exact: Deck;
};

export type DeckGlobSettings = DeckCommonSettings & {
  glob: string;
};

export type DeckRegexSettings = DeckCommonSettings & {
  regex: string;
};

interface DeckCommonSettings {
  // theme: string;
  message: string;
  indicator: RankiIndicator;
  config: RankiBaseConfigPartial;
}

interface HudConfig {
  order: HudComponentNames[];
  visibility: HudVisibility;
}

// TODO
// export type CardTypeSettings = {
//   theme: string;
//   config: RankiBaseConfigPartial;
// };

export interface RankiIndicatorMessage {
  message: string;
  indicator: RankiIndicator;
}

export type AnkiFlagColors =
  | "none"
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "pink"
  | "turquoise"
  | "purple";

export type RankiIndicator = "none" | "line" | "radial" | "linear";
export type AnkiFlagColorIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RankiBaseConfigPartial = DeepPartialSerializable<RankiBaseConfig>;

export type RankiLayout = "row" | "column";

export type RankiTagPrefix = string & { type: "RankiTagPrefix" };

export interface RankiBaseConfig {
  // TODO you need deck address stripping and hiding here
  faces: Record<AnkiCardFace, CardFaceArray>;
  design: {
    scheme: "dark" | "light" | "system";
    theme: string;
    layout: RankiLayout;
  };

  flags: Record<AnkiFlagColors, RankiIndicatorMessage>;
  marked: RankiIndicatorMessage;
  rankiTagPrefix: RankiTagPrefix;

  hud: HudConfig;
  dqm: DqmConfigPackPartial;
}

export type RankiGlobalConfigPartial =
  DeepPartialSerializable<RankiGlobalConfig>;

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiGlobalConfig {
  base: RankiBaseConfig;
  cards: DeckSettings[];
  decks: DeckSettings[];
  types: DeckSettings[];
  faces: DeckSettings[];
  tags: DeckSettings[];
}

export interface RankiAppConfig {
  hud: HudProps;
  order: CardFaceArray;
}

export interface RankiDqmConfig {
  inputs: DqmParseInputStructured;
  config: DqmConfigPackPartial;
  pref: IDqmRendererClientPreferences;
}

export interface Conf {
  ranki: RankiAppConfig;
  dqm: RankiDqmConfig;
}
