import type {
  RankiPluginParser,
  RankiGrammarTokens,
} from "@ranki/package-api-v2";
import { actions } from "./actions/actions.mjs";
import grammar from "../assets/ohm/2.0.66.ohm?raw";
import { handler } from "./handler.mjs";
import type { RankiLangParserPluginParseHandlerFrameV2 } from "./types.mjs";

type Single = string;

export interface RankiFrameV2ParserPluginConfig {
  tokens: {
    pause: Single;
    left: {
      outer: Single;
      inner: Single;
    };
    right: {
      outer: Single;
      inner: Single;
    };
    separator: {
      param: Single;
    };
  };
}

const config: RankiFrameV2ParserPluginConfig = {
  tokens: {
    pause: ",",

    left: {
      outer: "=",
      inner: "[",
    },
    right: {
      outer: "=",
      inner: "]",
    },
    separator: {
      param: "|",
    },
    // leftOuter: "=",
    // leftInner: "[",

    // rightInner: "]",
    // rightOuter: "=",
    // directive: "%",
    // frame: ":",
  },
};

function tokenize(config: RankiFrameV2ParserPluginConfig): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV2Pause"] = config.tokens.pause;
  // tokens["tFrameV2Directive"] = config.tokens.directive;
  // tokens["tFrameV2Frame"] = config.tokens.frame;

  tokens["tFrameV2LeftOuter"] = config.tokens.left.outer;
  tokens["tFrameV2LeftInner"] = config.tokens.left.inner;
  tokens["tFrameV2RightOuter"] = config.tokens.right.outer;
  tokens["tFrameV2RightInner"] = config.tokens.right.inner;
  tokens["tFrameV2SeparatorParam"] = config.tokens.separator.param;
  return tokens;
}

export const rankiFrameV2ParserPlugin: RankiPluginParser<
  RankiFrameV2ParserPluginConfig,
  RankiLangParserPluginParseHandlerFrameV2
> = {
  type: "parser",
  meta: {
    name: "RankiFrameV2",
    version: "2.0.66",
  },
  handler,
  dependencies: ["RankiParamsV2"],
  config,
  tokens: tokenize(config),
  grammar: () => grammar,
  actions: () => actions,
};
