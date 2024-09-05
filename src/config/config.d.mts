import type { RankiContent } from "../types/ranki-content.d.mts";
import type {
  Waveform,
  Amplitude,
} from "../audio-synthesis/audio-synthesis.types.mts";

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

export interface RankiAliases {
  code: Record<string, RankiCodeAlias>;
}

type Replacement = [string, string];

export interface AudioSynthesis {
  defaults: {
    waveform: Waveform;
    amplitude: Amplitude;
  };
}

export interface WindowRankiConfig {
  version: "v1";
  tokens: RankiTokens;
  aliases: RankiAliases;
  features: RankiFeatures;
  replacements: Replacement[];
  card: RankiCard;
  content: RankiContent;
  audioSynthesis: AudioSynthesis;
}

export type RankiDefaults = Pick<
  WindowRankiConfig,
  "features" | "tokens" | "aliases" | "replacements" | "audioSynthesis"
>;
