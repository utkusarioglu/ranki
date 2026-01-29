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
import type {
  AnkiCardFace,
  CardFaceArray,
  FilteredTags,
  RawFields,
} from "./collect/collect.types.mts";
import type { HudProps as RankiHudState } from "../components/hud/hud.types.mts";

export type Deck = string;

export type MatchTypes = "exact" | "glob" | "regex";

export type DeckSettings =
  | DeckExactSettings
  | DeckGlobSettings
  | DeckRegexSettings;

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
  cue?: DeckCueSystem;
  config: RankiBaseConfigPartial;
}

type DeckColorNames =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "magenta"
  | "tone";
type DeckColorLevels = 0 | 1 | 2;

export interface DeckCueSystem {
  bgColor?: `${DeckColorNames}-${DeckColorLevels}`;
  textColor?: `${DeckColorNames}-${DeckColorLevels}`;
  indicator?: RankiIndicatorName;
  message?: string;
}

export type CueKind =
  | "card"
  | "deck"
  | "type"
  | "face"
  | "tag:neutral"
  | "tag:marked"
  | "tag:ranki"
  | "flag";

export interface CueRecord extends DeckCueSystem {
  kind: CueKind;
  issuer: string;
}

interface HudConfig {
  order: HudComponentNames[];
  visibility: HudVisibility;
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

export type RankiIndicatorName = string & { type: "RankiIndicatorName" };

export type AnkiFlagColorIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type RankiBaseConfigPartial = DeepPartialSerializable<RankiBaseConfig>;

export type RankiLayout = "row" | "column";

export type RankiTagPrefix = string & { type: "RankiTagPrefix" };

export type RankiBaseScheme = "dark" | "light" | "system";

export type RankiPalette = string & { type: "RankiPalette" };

export type RankiAnimation = {
  fade: `${string}s`;
};

export interface RankiBaseDesign {
  animation: RankiAnimation;
  scheme: RankiBaseScheme;
  palette: RankiPalette;
  theme: RankiAppTheme;
  layout: RankiLayout;
}

export interface RankiIndicatorDefinition {
  name: RankiIndicatorName;
  style: string;
}

export type RankiBaseAddressMutationMode = "hide" | "trim" | "show";
export interface RankiBaseAddressMutation {
  start: string | number;
  end: string | number;
  mode: RankiBaseAddressMutationMode;
}

export interface RankiAddressTokens {
  separator: string;
  hide: string;
  trim: string;
}

export interface RankiDevToolsConfig {
  methods: boolean;
}

export interface RankiBaseConfig {
  // TODO you need deck address stripping and hiding here
  faces: Record<AnkiCardFace, CardFaceArray>;
  design: RankiBaseDesign;
  dev: RankiDevToolsConfig;

  palettes: PaletteSpecs[];
  indicators: RankiIndicatorDefinition[];
  flags: Record<AnkiFlagColors, DeckCueSystem>;
  tags: {
    ranki: {
      prefix: RankiTagPrefix;
      hide: boolean;
    };
    marked: DeckCueSystem;
  };
  address: {
    tokens: RankiAddressTokens;
    segments: RankiBaseAddressMutation[];
  };

  hud: HudConfig;
  dqm: DqmConfigPackPartial;
}

export type RankiConfigChannelsPartial =
  DeepPartialSerializable<RankiChannelsConfig>;

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiChannelsConfig {
  base: RankiBaseConfig;
  decks: DeckSettings[];
  cards: DeckSettings[];
  types: DeckSettings[];
  faces: DeckSettings[];
  flags: Record<AnkiFlagColors, DeckCommonSettings>;
  tags: DeckSettings[];
}

export type RankiAppDeterminedScheme = "light" | "dark";

export type RankiAppTheme = string & { type: "RankiAppTheme" };

export interface RankiDesignState {
  animation: RankiAnimation;
  scheme: RankiAppDeterminedScheme;
  palette: RankiPalette;
  theme: RankiAppTheme;
  layout: RankiLayout;
  paletteCollection: PaletteSpecs[];
}

export interface RankiDevState {
  methods: boolean;
}

export interface RankiChallengeState {
  order: CardFaceArray;
  dqm: RankiDqmConfig;
}

export interface RankiIndicatorState {
  indicatorCollection: RankiIndicatorDefinition[];
  cues: CueRecord[];
}

export interface RankiState {
  design: RankiDesignState;
  indicator: RankiIndicatorState;
  dev: RankiDevState;
  hud: RankiHudState;
  challenge: RankiChallengeState;
}

export interface RankiDqmConfig {
  inputs: DqmParseInputStructured;
  config: DqmConfigPackPartial;
  pref: IDqmRendererClientPreferences;
}

export interface PaletteSpecs {
  name: string;
  hues: Hues;
  lightness: Lightness;
  saturation: Saturation;
}

export type Hues = Record<string, number>;
export type Lightness = [number, number, number, number, number, number];
export type Saturation = [number, number, number, number, number, number];

export type ColorLevel = string; // index of Lightness

export type ColorFormat = "hex" | "rgb-csv";
export type Palette = Record<
  string,
  Record<ColorLevel, Record<ColorFormat, string>>
>;

export interface BuildRankiBaseConfigReturn {
  config: RankiBaseConfig;
  cueRecord: CueRecord[];
}

export interface RankiCollectedConfig {
  base: BuildRankiBaseConfigReturn;
  raw: RawFields;
  tags: FilteredTags;
}
