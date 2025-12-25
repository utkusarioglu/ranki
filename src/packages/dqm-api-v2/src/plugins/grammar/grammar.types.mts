import type {
  DqmConfig,
  DqmPluginName,
  DqmPluginVersion,
} from "../../config/dqm-config.types.mjs";
import type { IAstNodeActionDict } from "../../nodes/ast/base/i-ast-node.types.mjs";

export interface IDqmPluginGrammar<ConfigShape = {}> {
  type: "grammar";
  meta: {
    name: DqmPluginName;
    description: string;
    version: DqmPluginVersion;
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
