import type {
  RankiPluginParser,
  RankiGrammarTokens,
} from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.65.ohm?raw";
import { handler } from "./handler.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "./types.mjs";

type Single = string;

export interface RankiFrameV2ParserPluginConfig {
  tokens: {
    pause: Single;
    directive: Single;
    frame: Single;
  };
}

const config: RankiFrameV2ParserPluginConfig = {
  tokens: {
    pause: ",",
    directive: "%",
    frame: ":",
  },
};

function tokenize(config: RankiFrameV2ParserPluginConfig): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV2Pause"] = config.tokens.pause;
  tokens["tFrameV2Directive"] = config.tokens.directive;
  tokens["tFrameV2Frame"] = config.tokens.frame;
  return tokens;
}

export const rankiFrameV2ParserPlugin: RankiPluginParser<
  RankiFrameV2ParserPluginConfig,
  RankiLangParserPluginParseHandlerFrameV2
> = {
  type: "parser",
  meta: {
    name: "RankiFrameV2",
    version: "2.0.65",
  },
  handler,
  dependencies: ["RankiParamsV2"],
  config,
  tokens: tokenize(config),
  grammar: () => grammar,
  actions: () => actions,
};
