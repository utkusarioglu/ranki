import { RankiGrammarTokens } from "../export.mjs";

type Alternates = Single[];
type Single = string;

type PluginName = string;

interface PluginsConfig {
  // TODO
}

export interface RankiLanguageProvidedConfig {
  tags: string[]; // these may be anki args
  plugins: {
    requested: PluginName[];
    config: PluginsConfig;
  };
  content: RankiLanguageContentConfig;
}

export interface RankiLanguageContentConfig {
  prefix: string;
  suffix: string;
}

// TODO this will need to be a generic
export interface RankiLanguageMergedConfig {
  tags: string[]; // these may be anki args
  plugins: {
    standards: PluginName[];
    requested: PluginName[];
    config: PluginsConfig;
  };
  grammar: {
    tokens: Record<string, RankiGrammarTokens>;
  };
  content: RankiLanguageContentConfig;
}

export type RankiLanguageDefaultConfig = RankiLanguageMergedConfig;

export type RankiLanguageContextConfig = Omit<RankiLanguageConfig, "merged">;

export interface RankiLanguageConfig {
  default: RankiLanguageDefaultConfig;
  // TODO maybe an inferred type for each array element would be better
  provided: RankiLanguageProvidedConfig[];
  merged: RankiLanguageMergedConfig;
}
