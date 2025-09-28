type Alternates = Single[];
type Single = string;

type PluginName = string;

interface TokensConfig {
  richTextV2: {
    sentence: {
      period: Single;
      question: Single;
      exclamation: Single;
    };
  };
  paramsV2: {
    separator: {
      left: Single;
      right: Single;
    };
    key: {
      negation: Single;
    };
    operators: {
      assign: Single;
      append: Single;
      remove: Single;
    };
  };
  richNumberV2: {
    complexUnits: Alternates;
    infinity: Alternates;
    e: Alternates;
    pi: Alternates;
    hexadecimal: Alternates;
    octal: Alternates;
    binary: Alternates;
    decimal: Single;
    negative: Single;
    group: Single;
  };
}

export interface RankiLanguageUserConfig {
  tags: string[]; // these may be anki args
  plugins: {
    // standards: PluginName[];
    requested: PluginName[];
  };
  tokens: TokensConfig;
}

export interface RankiLanguageMergedConfig {
  tags: string[]; // these may be anki args
  plugins: {
    standards: PluginName[];
    requested: PluginName[];
  };
  tokens: TokensConfig;
}

export type RankiLanguageDefaultConfig = RankiLanguageMergedConfig;

export type RankiLanguageContextConfig = Omit<RankiLanguageConfig, "merged">;

export interface RankiLanguageConfig {
  default: RankiLanguageDefaultConfig;
  user: RankiLanguageUserConfig;
  merged: RankiLanguageMergedConfig;
}
