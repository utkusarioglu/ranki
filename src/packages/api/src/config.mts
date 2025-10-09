type Alternates = Single[];
type Single = string;

type PluginName = string;

interface PluginsConfig {
  RankiBaseV2: {
    tokens: {
      escape: Single;
    };
  };
  RankiFrameV1: {
    tokens: {
      delimiter: Single;
    };
  };
  RankiFrameV2: {
    tokens: {
      pause: Single;
      directive: Single;
      frame: Single;
    };
    // sepLeft: Single;
    // sepRight: Single;
  };
  RankiRichTextV2: {
    tokens: {
      sentence: {
        period: Single;
        question: Single;
        exclamation: Single;
      };
      line: {
        align: Single;
        heading: Single;
        small: Single;
      };
      decoration: {
        emphasis: Single;
        bold: Single;
        idiomatic: Single;
        underline: Single;
        abbreviation: Single;
      };
    };
  };
  RankiRichStructureV2: {
    tokens: {
      delimiter: Single;
    };
  };
  RankiParamsV2: {
    tokens: {
      separator: {
        param: Single;
        frame: Single;
      };
      key: {
        directive: Single;
        negation: Single;
      };
      operators: {
        assign: Single;
        append: Single;
        remove: Single;
      };
    };
  };
  RankiRichNumberV2: {
    tokens: {
      symbol: {
        complex: Alternates;
        infinity: Alternates;
        e: Alternates;
        pi: Alternates;
      };
      base: {
        hexadecimal: Alternates;
        octal: Alternates;
        binary: Alternates;
      };
      operator: {
        negative: Single;
        positive: Single;
        minusPlus: Alternates;
        plusMinus: Alternates;
        rational: Single;
      };
      number: {
        decimal: Single;
        group: Single;
      };
    };
  };
}

export interface RankiLanguageUserConfig {
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
  user: RankiLanguageUserConfig;
  merged: RankiLanguageMergedConfig;
}
