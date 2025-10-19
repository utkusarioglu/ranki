import type { RankiGrammarTokens } from "@ranki/package-api-v2";
import type { RankiFrameV2ParserPluginConfig } from "./types/config.mjs";

export const config: RankiFrameV2ParserPluginConfig = {
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
  },
};

export function tokenize(
  config: RankiFrameV2ParserPluginConfig,
): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV2Pause"] = config.tokens.pause;
  tokens["tFrameV2LeftOuter"] = config.tokens.left.outer;
  tokens["tFrameV2LeftInner"] = config.tokens.left.inner;
  tokens["tFrameV2RightOuter"] = config.tokens.right.outer;
  tokens["tFrameV2RightInner"] = config.tokens.right.inner;
  tokens["tFrameV2SeparatorParam"] = config.tokens.separator.param;
  return tokens;
}
