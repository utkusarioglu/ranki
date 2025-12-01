import type { DqmGrammarTokens } from "../plugins/grammar/grammar.types.mjs";

type DqmStages = "ast" | "validate" | "transform";

type DqmPluginCode = string;

export type DqmPluginsConfig = Record<string, any>;
// TODO

/**
 * This is the shape of the config for the Dqm. It has nothing to do with
 * merging or managing the config. That is handled by `IConfig`
 */
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
