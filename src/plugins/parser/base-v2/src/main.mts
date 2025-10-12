import { RankiPluginParser, RankiGrammarTokens } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.64.ohm?raw";
import { actions } from "./actions.mjs";

type Single = string;

export interface RankiBaseV2ParserPluginConfig {
  tokens: {
    escape: Single;
  };
}

const config: RankiBaseV2ParserPluginConfig = {
  tokens: {
    escape: "\\\\",
  },
};

function tokenize(config: RankiBaseV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  return tokens;
}

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.64",
    },
    dependencies: ["RankiConstantsV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    actions: () => actions,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
