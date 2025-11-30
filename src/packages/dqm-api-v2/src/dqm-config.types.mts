import type { DqmGrammarTokens } from "./plugins/grammar/grammar.types.mjs";

type DqmStages = "ast" | "validate" | "transform";

type DqmPluginCode = string;

export type DqmPluginsConfig = Record<string, any>;
// TODO

// export type DqmGrammarTokens = Record<
//   string,
//   boolean | number | string | string[]
// >;

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
