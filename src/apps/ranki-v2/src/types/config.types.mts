import type { DqmConfigPackPartial } from "@dqm/package-dqm-v2";
import type { HudComponentNames } from "../components/hud/hud.types.mjs";
import type { DeepPartialSerializable } from "./util.types.mjs";
import type { CardFaceArray } from "../collect/collect.types.mts";

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
  theme: string;
  config: RankiBaseConfigPartial;
}

interface HudConfig {
  order: HudComponentNames[];
}

// TODO
export type CardTypeSettings = {
  theme: string;
  config: RankiBaseConfigPartial;
};

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

export interface TagSettings {
  exact: string;
  message: string;
  indicator: RankiIndicator;
  config: RankiBaseConfigPartial;
}

export type RankiLayout = "row" | "column";

export interface RankiBaseConfig {
  // TODO you need deck address stripping and hiding here

  question: CardFaceArray;
  answer: CardFaceArray;

  scheme: "dark" | "light" | "system";
  theme: string;
  layout: RankiLayout;

  flags: Record<AnkiFlagColors, RankiIndicatorMessage>;
  mark: RankiIndicatorMessage;

  hud: HudConfig;
  dqm: DqmConfigPackPartial;
}

export type RankiGlobalConfigPartial =
  DeepPartialSerializable<RankiGlobalConfig>;

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiGlobalConfig {
  base: RankiBaseConfig;
  cards: CardTypeSettings[];
  decks: DeckSettings[];
  tags: TagSettings[];
}
