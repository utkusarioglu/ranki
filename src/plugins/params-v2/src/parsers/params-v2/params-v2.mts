import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";
import { tokenizer } from "./tokenizer.mjs";
import { config } from "./params-v2.config.mjs";
import { actions } from "./actions/actions.mjs";
import type { ParamsV2GrammarConfig } from "./params-v2.types.mjs";
import { version, grammar } from "./params-v2.grammar.mjs";

export const paramsV2Grammar: IDqmPluginGrammar<ParamsV2GrammarConfig> = {
  type: "grammar",
  meta: {
    name: "ParamsV2",
    description: "Allows components to consume the ParamV2 format parameters",
    version,
  },
  dependencies: ["BaseV2"],
  config: () => config,
  tokenizer: () => tokenizer(config),
  grammar: () => grammar,
  actions: () => actions,
};
