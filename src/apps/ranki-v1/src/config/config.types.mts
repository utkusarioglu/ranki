import type { RankiContent } from "../types/ranki-content.types.mts";
import type {
  Waveform,
  Amplitude,
} from "../audio-synthesis/audio-synthesis.types.mts";

export type RankiRequiredProps = "version" | "features" | "card" | "content";

export type CardFaces = "front" | "back";

export interface RankiTokens {
  cardTypesPrefix: string;
  frame: string;
  inlineFrameAllowedEndCharacters: string[];
  child: string;
  terminator: string;
  parameter: string;
  assignment: string;
  comment: string;
  heading: string;
  centeredText: string;
  deckSeparator: string;
  tagSeparator: string;
  tableHeads: string;
  tableHeadTags: string;
  tableFoots: string;
  tableFootTags: string;
  tableBodyTags: string;
  listTags: string;
  listItemSeparator: string;
  dlDtTags: string;
  dlDdTags: string;
}

export interface RankiFeatures {}

export interface RankiCard {
  deck: string;
  subdeck: string;
  tags: string;
  type: string;
  flag: string;
  card: string;
}

interface RankiCodeAlias {
  list: string[];
  displayName: string;
}

export interface RankiCode {
  aliases: Record<string, RankiCodeAlias>;
  replacements: RegExp[];
}

type Replacement = [string | RegExp, string];

export interface AudioSynthesis {
  defaults: {
    waveform: Waveform;
    amplitude: Amplitude;
    duration: number;
  };
}

export interface MermaidConfig {
  theme: string;
  themeVariables: Record<string, any>;
}

export type RankiFlagAssignments = Record<string, string>;

export interface WindowRankiConfig {
  version: "v1";
  flagAssignments: RankiFlagAssignments;
  tokens: RankiTokens;
  code: RankiCode;
  features: RankiFeatures;
  replacements: Replacement[];
  card: RankiCard;
  content: RankiContent;
  audioSynthesis: AudioSynthesis;
  mermaid: MermaidConfig;
}

export type RankiDefaults = Pick<
  WindowRankiConfig,
  | "features"
  | "tokens"
  | "code"
  | "replacements"
  | "audioSynthesis"
  | "mermaid"
  | "flagAssignments"
>;
