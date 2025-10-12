import type {
  RankiGrammarTokens,
  RankiPluginParser,
} from "@ranki/package-api-v2";
import grammar from "../assets/ohm/2.0.63.ohm?raw";
import { actions } from "./actions.mjs";
import { FrameV1, handler } from "./handler.mjs";

type Single = string;

export interface RankiFrameV1ParserPluginConfig {
  tokens: {
    delimiter: Single;
  };
}

const config: RankiFrameV1ParserPluginConfig = {
  tokens: {
    delimiter: ":::",
  },
};

function tokenize(config: RankiFrameV1ParserPluginConfig): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV1Delimiter"] = config.tokens.delimiter;
  return tokens;
}

export const rankiFrameV1ParserPlugin: RankiPluginParser<
  RankiFrameV1ParserPluginConfig,
  FrameV1
> = {
  type: "parser",
  meta: {
    version: "2.0.63",
    name: "RankiFrameV1",
  },
  handler,
  dependencies: ["RankiBaseV2"],
  config,
  tokens: tokenize(config),
  grammar: () => grammar,
  actions: () => actions,
};
