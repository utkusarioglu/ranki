import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./base-v2.config.mjs";
import type { BaseV2GrammarConfig } from "./base-v2.types.mjs";

export const baseV2Grammar: IDqmPluginGrammar<BaseV2GrammarConfig> = {
  type: "grammar",
  meta: {
    name: "BaseV2",
    description: "Default parser for RankiV2",
    version: "0.0.0",
  },
  dependencies: ["ConstantsV2"],
  config: () => config,
  tokenizer: () => tokenizer(config),
  grammar: () => "",
  actions: () => ({}),
};
