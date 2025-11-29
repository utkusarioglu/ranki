type DqmStages = "ast" | "validate" | "transform";

type DqmPluginCode = string;

interface DqmPluginsConfig {
  // TODO
}

export type DqmGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export interface DqmConfig {
  stage: DqmStages;
  plugins: {
    standards: DqmPluginCode[];
    requested: DqmPluginCode[];
    config: DqmPluginsConfig;
  };
  grammar: {
    tokens: Record<string, DqmGrammarTokens>;
  };
  content: {
    prefix: string;
    suffix: string;
  };
}
