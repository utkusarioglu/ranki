import type { DqmConfig } from "../../config/dqm-config.types.mjs";
import type { IAstNodeActionDict } from "../../export.types.mjs";

export interface IDqmPluginGrammar<ConfigShape = {}> {
  type: "grammar";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  dependencies: string[];
  tokenizer: () => DqmGrammarTokens;
  config: (defaultConfig: DqmConfig) => ConfigShape;
  grammar: (config: DqmConfig) => string;
  actions: () => ActionsDictRecord;
  // TODO
  // validators:
}

export type DqmGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type ActionsDictRecord = Record<string, IAstNodeActionDict>;
