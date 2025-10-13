import { RankiGrammarTokens, RankiPluginParser } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiRichStructureV2ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

const config: RankiRichStructureV2ParserPluginConfig = {
  tokens: {
    delimiter: "~",
  },
};

function tokenize(
  config: RankiRichStructureV2ParserPluginConfig,
): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tRichStructureV2Delimiter"] = config.tokens.delimiter;
  return tokens;
}

export const rankiRichStructureV2ParserPlugin: RankiPluginParser<RankiRichStructureV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiRichStructureV2",
      version: "2.0.63",
    },
    dependencies: ["RankiBaseV2", "RankiParamsV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    validations: () => ({}),
    actions: () => actions,
  };
