import type { IDqmPluginGrammar } from "@ranki/package-dqm-api-v2";
import { buildGrammar } from "./grammar.mjs";

export const constantsV2Grammar: IDqmPluginGrammar = {
  type: "grammar",
  meta: {
    name: "ConstantsV2",
    description: "Provides constant values and tokens to the OhmJS parser",
    version: "0.0.0",
  },
  dependencies: [],
  tokenizer: () => ({
    rootBlock: "",
  }),
  config: () => ({}),
  grammar: buildGrammar,
  actions: () => ({}),
};
