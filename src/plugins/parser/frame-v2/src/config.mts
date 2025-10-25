import type { RankiGrammarTokens } from "@ranki/package-api-v2";
import type { RankiFrameV2ParserPluginConfig } from "./types/config.mjs";

export const config: RankiFrameV2ParserPluginConfig = {
  tokens: {
    pause: ",",

    opener: "[",
    closer: "]",
    separator: {
      param: "|",
    },
  },
};

export function tokenizer(
  config: RankiFrameV2ParserPluginConfig,
): RankiGrammarTokens {
  const tokens: RankiGrammarTokens = {};
  tokens["tFrameV2Pause"] = config.tokens.pause;

  const openerLength = config.tokens.opener.length;
  const closerLength = config.tokens.closer.length;
  if (openerLength === 0) {
    throw new Error(`FRAME V2 OPENER HAS TO HAVE AT LEAST ONE CHARACTER`);
  }
  if (closerLength === 0) {
    throw new Error(`FRAME V2 CLOSER HAS TO HAVE AT LEAST ONE CHARACTER`);
  }

  tokens["tFrameV2LeftOuter"] = config.tokens.opener;
  tokens["tFrameV2RightOuter"] = config.tokens.closer;

  tokens["tFrameV2SeparatorParam"] = config.tokens.separator.param;
  return tokens;
}
