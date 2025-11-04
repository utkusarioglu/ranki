import type { RankiGrammarTokens } from "../export.type.mjs";

type PluginName = string;

interface PluginsConfig {
  // TODO
}

export interface RankiLanguageProvidedConfig {
  stage: Stages;
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

type Stages = "ast" | "validate" | "transform";

export interface RankiLanguageMergedConfig {
  stage: Stages;
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
