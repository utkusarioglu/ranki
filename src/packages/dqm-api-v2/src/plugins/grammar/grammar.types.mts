import type {
  DqmConfig,
  DqmInternalConfig,
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
  // tokenizer: (s: ConfigShape) => DqmGrammarTokens;
  // TODO any
  tokenizer: (s: any) => DqmGrammarTokens;
  config: (defaultConfig: DqmConfig) => ConfigShape;
  grammar: (config: DqmInternalConfig) => string;
  actions: () => ActionsDictRecord;
  // TODO
  // validators:
}

export type DqmGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type ActionsDictRecord = Record<string, IAstNodeActionDict>;
