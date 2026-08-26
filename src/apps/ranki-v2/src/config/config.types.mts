import type {
  AnkiCardFace,
  CardFaceArray,
  FilteredTags,
} from "_collect/collect.types.mjs";
import type {
  HudComponentNames,
  HudElementCommon,
  HudVisibility,
  RankiHudState,
  RankiHudStateAnimation,
} from "_components/hud/hud.types.mjs";
import type { GeometryAnimationPresetDict } from "_controllers/geometry/controller/animator/types/library.types.mjs";
import type {
  DqmConfigPackPartial,
  DqmParseInputStructured,
  IDqmRendererClientPreferences,
} from "@dqm/package-dqm-v2";

import type { DeepPartialSerializable } from "../types/util.types.mjs";

export type AnkiFlagColorIndices = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AnkiFlagColors =
  | "blue"
  | "green"
  | "none"
  | "orange"
  | "pink"
  | "purple"
  | "red"
  | "turquoise";

export interface BuildRankiBaseConfigReturn {
  config: RankiBaseConfig;
  cueRecord: CueRecord[];
}

export type ColorFormat = "hex" | "rgb-csv";

export type ColorLevel = { type?: "ColorLevel" } & string; // index of Lightness

export interface CueConfig {
  background?: {
    color: "none" | `${DeckColorNames}-${DeckColorLevels}`;
  };
  icon?: {
    color?: "none" | `${DeckColorNames}-${DeckColorLevels}`;
    id: string;
  };
  indicator?: RankiIndicatorName;
  message?: {
    color?: "none" | `${DeckColorNames}-${DeckColorLevels}`;
    text: string;
  };
}

export type CueKind =
  | "always"
  | "card"
  | "deck"
  | "face"
  | "flag"
  | "tag:marked"
  | "tag:neutral"
  | "tag:ranki"
  | "type"
  | "webview";

export interface CueRecord extends CueConfig {
  issuer: string;
  type: CueKind;
}

export type Deck = { type?: "Deck" } & string;
export type DeckAlwaysSettings = Partial<DeckCommonSettings>;

export type DeckExactSettings = {
  exact: Deck;
} & DeckCommonSettings;

export type DeckGlobSettings = {
  glob: string;
} & DeckCommonSettings;

export type DeckRegexSettings = {
  regex: string;
} & DeckCommonSettings;

export type DeckSettings =
  | DeckExactSettings
  | DeckGlobSettings
  | DeckRegexSettings;

export type Hues = Record<string, number>;

export type Lightness = [number, number, number, number, number, number];

export type MatchTypes = "exact" | "glob" | "regex";

export type Palette = Record<
  string,
  Record<ColorLevel, Record<ColorFormat, string>>
>;

export interface PaletteSpecs {
  hues: Hues;
  lightness: Lightness;
  name: string;
  saturation: Saturation;
}

export interface ProcessedCue extends CueRecord {
  animation: RankiPropAnimationBlock;
  // target: {
  //   indicator: boolean;
  //   hud: boolean;
  // };
  // is: {
  //   badge: boolean;
  //   chip: boolean;
  //   label: boolean;
  // };
  // has: {
  //   icon: boolean;
  //   message: boolean;
  //   background: boolean;
  //   indicator: boolean;
  // };
}

export type ProcessedCueMap = {
  hud: ProcessedCueMapHud;
  indicators: ProcessedCue[];
};

export interface ProcessedCueMapHud extends HudElementCommon {
  animation: RankiHudStateAnimation;
  subtree: {
    badges: CueRecord[];
    chips: CueRecord[];
    labels: CueRecord[];
  };
}

export interface RankiAddressTokens {
  hide: string;
  separator: string;
  trim: string;
}

export type RankiAnimation = {
  // {
  //   enabled: boolean;
  // };
  challenge: RankiPropAnimationBlock;
  enabled: boolean;
  // FIX this needs to go
  fade: `${string}s`;
  hud: RankiPropAnimationBlock;
  // {
  //   enabled: boolean;
  // };
  indicator: RankiPropAnimationBlock;
  // {
  //   enabled: boolean;
  // };
};

export type RankiAppDeterminedScheme = "dark" | "light";

export type RankiAppTheme = { type: "RankiAppTheme" } & string;

export interface RankiBaseAddressMutation {
  end: number | string;
  mode: RankiBaseAddressMutationMode;
  start: number | string;
}

export type RankiBaseAddressMutationMode = "hide" | "show" | "trim";

export interface RankiBaseConfig {
  address: {
    segments: RankiBaseAddressMutation[];
    tokens: RankiAddressTokens;
  };
  animations: GeometryAnimationPresetDict;
  design: RankiBaseDesign;

  dev: RankiDevToolsConfig;
  dqm: DqmConfigPackPartial;
  // TODO you need deck address stripping and hiding here
  faces: Record<AnkiCardFace, CardFaceArray>;
  flags: RankiBaseConfigFlags;
  hud: HudConfig;
  indicators: RankiIndicatorDefinition[];

  palettes: PaletteSpecs[];
  tags: {
    marked: CueConfig;
    ranki: {
      hide: boolean;
      prefix: RankiTagPrefix;
    };
  };
}

export type RankiBaseConfigFlags = Record<AnkiFlagColors, CueConfig>;

export type RankiBaseConfigPartial = DeepPartialSerializable<RankiBaseConfig>;

export interface RankiBaseDesign {
  animation: RankiAnimation;
  layout: RankiLayout;
  palette: RankiPalette;
  scheme: RankiBaseScheme;
  theme: RankiAppTheme;
}

export type RankiBaseScheme = "dark" | "light" | "system";

export interface RankiChallengeState {
  animation: RankiChallengeStateAnimation;
  dqm: RankiDqmConfig;
  face: AnkiCardFace;
  order: CardFaceArray;
}

export type RankiChallengeStateAnimation = RankiAnimation["challenge"];

// DECIDE this here is in the order that the config would ingest it, giving
// tags the highest priority
export interface RankiChannelsConfig {
  always: DeckAlwaysSettings[];
  base: RankiBaseConfig;
  cards: DeckSettings[];
  decks: DeckSettings[];
  faces: DeckSettings[];
  flags: RankiFlags;
  tags: DeckSettings[];
  types: DeckSettings[];
  webview: DeckSettings[];
}

export interface RankiCollectedConfig {
  base: BuildRankiBaseConfigReturn;
  // raw: RawFields;
  tags: FilteredTags;
}

export type RankiConfigChannelsPartial =
  DeepPartialSerializable<RankiChannelsConfig>;

export interface RankiDesignState {
  animation: RankiAnimation;
  animationCollection: GeometryAnimationPresetDict;
  layout: RankiLayout;
  palette: RankiPalette;
  paletteCollection: PaletteSpecs[];
  scheme: RankiAppDeterminedScheme;
  theme: RankiAppTheme;
}

export interface RankiDevState {
  methods: boolean;
  persist: boolean;
  throw: boolean;
}

export interface RankiDevToolsConfig {
  methods: boolean;
  persist: boolean;
  throw: boolean;
}

export interface RankiDqmConfig {
  config: DqmConfigPackPartial;
  inputs: DqmParseInputStructured;
  pref: IDqmRendererClientPreferences;
}

export type RankiFlags = Record<AnkiFlagColors, DeckCommonSettings>;

export interface RankiIndicatorDefinition {
  name: RankiIndicatorName;
  style: string;
}

export type RankiIndicatorName = { type: "RankiIndicatorName" } & string;

export interface RankiIndicatorState {
  animation: RankiIndicatorStateAnimation;
  cues: ProcessedCue[];
  indicatorCollection: RankiIndicatorDefinition[];
}

export type RankiIndicatorStateAnimation = RankiAnimation["indicator"];

export type RankiLayout = "column" | "row";

export type RankiPalette = { type: "RankiPalette" } & string;
export interface RankiPropAnimationBlock {
  duration: number;
  enabled: boolean;
  preset: string;
}
export interface RankiState {
  challenge: RankiChallengeState;
  design: RankiDesignState;
  dev: RankiDevState;
  hud: RankiHudState;
  indicator: RankiIndicatorState;
}

export type RankiTagPrefix = { type: "RankiTagPrefix" } & string;

export type Saturation = [number, number, number, number, number, number];
type DeckColorLevels = 0 | 1 | 2;

type DeckColorNames =
  | "blue"
  | "green"
  | "magenta"
  | "orange"
  | "purple"
  | "red"
  | "tone"
  | "yellow";

interface DeckCommonSettings {
  config: RankiBaseConfigPartial;
  cue?: CueConfig;
}

interface HudConfig {
  order: HudComponentNames[];
  visibility: HudVisibility;
}
