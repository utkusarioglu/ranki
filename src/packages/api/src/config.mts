type Alternates = Single[];
type Single = string;

type PluginName = string;

export interface RankiConfig {
  plugins: {
    standards: PluginName[];
    requested: PluginName[];
  };
  tokens: {
    sentence: {
      period: Single;
      question: Single;
      exclamation: Single;
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
  };
}
