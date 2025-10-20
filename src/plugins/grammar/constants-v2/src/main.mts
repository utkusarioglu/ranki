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
    tokens: {
      root: "",
    },
    grammar: (c) => buildGrammar(c.merged),
    validators: () => ({}),
    transformers: () => ({}),
    actions: () => ({}),
  };
