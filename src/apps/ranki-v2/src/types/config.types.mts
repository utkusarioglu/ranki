import type {
  DqmConfigPackPartial,
  DqmParseTheater,
} from "@dqm/package-dqm-v2";
import type { HudComponentNames } from "../components/card-hud/hud.types.mts";
import type { DeepPartialSerializable } from "./util.types.mts";

export type Deck = string;

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
  theme?: string;
  config?: RankiBaseConfigPartial;
}

interface HudConfig {
  order: HudComponentNames[];
}

// TODO
export type CardTypeSettings = {
  theme?: string;
  config?: RankiBaseConfigPartial;
};

export interface RankiIndicatorMessage {
  message?: string;
  indicator?: RankiIndicator;
}

type AnkiFlagColors =
  | "red"
  | "orange"
  | "green"
  | "blue"
  | "pink"
  | "turquoise"
  | "purple";

export type RankiIndicator = "none" | "line" | "radial" | "linear";

type RankiBaseConfigPartial = DeepPartialSerializable<RankiBaseConfig>;

export interface TagSettings {
  exact: string;
  message?: string;
  indicator?: RankiIndicator;
  config?: RankiBaseConfigPartial;
  // base?: RankiBaseConfig;
  // dqm?: DqmConfigPackPartial;
}

interface RankiBaseConfig {
  // TODO you need deck address stripping and hiding here

  question: DqmParseTheater[];
  answer: DqmParseTheater[];
  divider: boolean;

  scheme: "dark" | "light" | "system";
  theme: string;
  layout: "row" | "column";

  flags: Record<AnkiFlagColors, RankiIndicatorMessage>;
  mark: RankiIndicatorMessage;

  hud: HudConfig;
  dqm: DqmConfigPackPartial;
}

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiConfig {
  base: RankiBaseConfig;
  cards: CardTypeSettings[];
  decks: DeckSettings[];
  tags: TagSettings[];
}
