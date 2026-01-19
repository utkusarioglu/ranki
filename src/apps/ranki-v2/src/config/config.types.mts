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
  message: string;
  indicator: RankiIndicatorName;
  config: RankiBaseConfigPartial;
}

interface HudConfig {
  order: HudComponentNames[];
  visibility: HudVisibility;
}

export interface RankiIndicatorMessage {
  message: string;
  indicator: RankiIndicatorName;
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

export type AnimationDuration = `${string}s`;

export interface RankiBaseDesign {
  animationDuration: AnimationDuration;
  scheme: RankiBaseScheme;
  palette: RankiPalette;
  theme: RankiAppTheme;
  layout: RankiLayout;
}

export interface RankiIndicatorDefinition {
  name: RankiIndicatorName;
  style: string;
}

export interface RankiBaseConfig {
  // TODO you need deck address stripping and hiding here
  faces: Record<AnkiCardFace, CardFaceArray>;
  design: RankiBaseDesign;

  palettes: PaletteSpecs[];
  indicators: RankiIndicatorDefinition[];
  flags: Record<AnkiFlagColors, RankiIndicatorMessage>;
  tags: {
    ranki: {
      prefix: RankiTagPrefix;
      hide: boolean;
    };
    marked: RankiIndicatorMessage;
  };

  hud: HudConfig;
  dqm: DqmConfigPackPartial;
}

export type RankiConfigChannelsPartial =
  DeepPartialSerializable<RankiConfigChannels>;

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiConfigChannels {
  base: RankiBaseConfig;
  cards: DeckSettings[];
  decks: DeckSettings[];
  types: DeckSettings[];
  faces: DeckSettings[];
  tags: DeckSettings[];
}

export type RankiAppDeterminedScheme = "light" | "dark";

export type RankiAppTheme = string & { type: "RankiAppTheme" };

export interface RankiAppDesign {
  animationDuration: AnimationDuration;
  scheme: RankiAppDeterminedScheme;
  palette: RankiPalette;
  theme: RankiAppTheme;
  layout: RankiLayout;
}

export interface RankiAppConfig {
  face: AnkiCardFace;
  design: RankiAppDesign;
  palettes: PaletteSpecs[];
  indicators: RankiIndicatorDefinition[];

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

export interface PaletteSpecs {
  name: string;
  hues: Hues;
  lightness: Lightness;
  saturation: Saturation;
}

export type Hues = Record<string, number>;
export type Lightness = [number, number, number, number, number, number];
export type Saturation = [number, number, number, number, number, number];

// = number & { type: "Saturation" };

export type ColorLevel = string; // index of Lightness

export type Palette = Record<string, Record<ColorLevel, string>>;
