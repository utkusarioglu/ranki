import type { RankiPluginParser } from "@ranki/package-api-v2";
import { buildGrammar } from "./grammar.mjs";

export interface RankiConstantsV2ParserPluginConfig {}

export const rankiConstantsV2ParserPlugin: RankiPluginParser<RankiConstantsV2ParserPluginConfig> =
  {
    type: "parser",
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
    actions: () => ({}),
  };
