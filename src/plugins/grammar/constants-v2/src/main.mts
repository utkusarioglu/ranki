import type { RankiPluginGrammar } from "@ranki/package-api-v2";
import { buildGrammar } from "./grammar.mjs";

export interface RankiConstantsV2ParserPluginConfig {}

export const rankiConstantsV2ParserPlugin: RankiPluginGrammar<RankiConstantsV2ParserPluginConfig> =
  {
    type: "grammar",
    meta: {
      version: "2.0.64",
      name: "RankiConstantsV2",
    },
    dependencies: [],
    config: {},
    tokenizer: () => ({
      rootBlock: "",
    }),
    grammar: buildGrammar,
    validators: () => ({}),
    // transformers: () => ({}),
    actions: () => ({}),
  };
