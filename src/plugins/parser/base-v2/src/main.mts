import { RankiPluginParser, RankiGrammarTokens } from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { actions } from "./actions.mjs";
import { validators } from "./validators.mjs";
import { transformers } from "./transformers.mjs";

type Single = string;

export interface RankiBaseV2ParserPluginConfig {
  tokens: {
    ignore: Single;
    escape: Single;
  };
}

const config: RankiBaseV2ParserPluginConfig = {
  tokens: {
    ignore: "% ignore",
    escape: "\\\\",
  },
};

function tokenize(config: RankiBaseV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  tokens["tBaseV2Ignore"] = config.tokens.ignore;
  return tokens;
}

export const rankiBaseV2ParserPlugin: RankiPluginParser<RankiBaseV2ParserPluginConfig> =
  {
    type: "parser",
    meta: {
      name: "RankiBaseV2",
      version: "2.0.65",
    },
    dependencies: ["RankiConstantsV2"],
    config,
    tokens: tokenize(config),
    grammar: () => grammar,
    actions: () => actions,
    validators,
    transformers,
  };

export type { NodeArgsBaseV2 } from "./type.mjs";
