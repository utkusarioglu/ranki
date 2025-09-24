export interface RankiConfig {
  tokens: {
    sentence: {
      period: string;
      question: string;
      exclamation: string;
    };
    paramsV2: {
      separator: {
        left: string;
        right: string;
      };
      key: {
        negation: string;
      };
      operators: {
        assign: string;
        append: string;
        remove: string;
      };
    };
    richNumberV1: {
      complexUnits: string[];
      infinity: string[];
      e: string[];
      pi: string[];
      hexadecimal: string[];
      octal: string[];
      binary: string[];
      decimal: string;
      negative: string;
      group: string;
    };
  };
}
