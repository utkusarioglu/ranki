export interface ParamsV2GrammarConfig {
  tokens: {
    separator: {
      param: string;
      keyLevel: string;
    };
    key: {
      directive: string;
      negation: string;
    };
    operators: {
      assign: string;
      append: string;
      remove: string;
    };
  };
}
