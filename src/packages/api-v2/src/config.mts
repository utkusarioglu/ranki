type Alternates = Single[];
type Single = string;

type PluginName = string;

interface PluginsConfig {
  // RankiBaseV2: {};
  // RankiFrameV1: {};
  // RankiFrameV2: {
  // sepLeft: Single;
  // sepRight: Single;
  // };
  // RankiRichTextV2: {};
  // RankiRichStructureV2: {};
  // RankiParamsV2: {};
  // RankiRichNumberV2: {
  // };
}

export interface RankiLanguageProvidedConfig {
  tags: string[]; // these may be anki args
  plugins: {
    // standards: PluginName[];
    requested: PluginName[];
    config: PluginsConfig;
  };
  content: RankiLanguageContentConfig;
  // tokens: PluginsConfig;
}

export interface RankiLanguageContentConfig {
  prefix: string;
  prefixLine: string;
  suffix: string;
  suffixLine: string;
}

// TODO this will need to be a generic
export interface RankiLanguageMergedConfig {
  tags: string[]; // these may be anki args
  plugins: {
    standards: PluginName[];
    requested: PluginName[];
    config: PluginsConfig;
  };
  content: RankiLanguageContentConfig;
  // tokens: PluginsConfig;
}

export type RankiLanguageDefaultConfig = RankiLanguageMergedConfig;

export type RankiLanguageContextConfig = Omit<RankiLanguageConfig, "merged">;

export interface RankiLanguageConfig {
  default: RankiLanguageDefaultConfig;
  provided: RankiLanguageProvidedConfig[];
  merged: RankiLanguageMergedConfig;
}
