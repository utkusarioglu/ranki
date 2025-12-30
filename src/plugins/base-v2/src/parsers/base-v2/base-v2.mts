import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./base-v2.config.mjs";
import type { BaseV2GrammarConfig } from "./base-v2.types.mjs";
import { actions } from "./actions/actions.mjs";
import { version, grammar } from "./base-v2.grammar.mjs";

export const baseV2Grammar: IDqmPluginGrammar<BaseV2GrammarConfig> = {
  type: "grammar",
  meta: {
    name: "BaseV2",
    description: "Default parser for RankiV2",
    version,
  },
  dependencies: ["grammar:ConstantsV2"],
  config: () => config,
  tokenizer,
  grammar: () => grammar,
  actions: () => actions,
};
