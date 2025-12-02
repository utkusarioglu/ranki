import type { DqmGrammarTokens } from "@dqm/package-dqm-api-v2";
import type { FrameV2GrammarConfig } from "./frame-v2.types.mjs";

export function tokenizer(config: FrameV2GrammarConfig): DqmGrammarTokens {
  const tokens: DqmGrammarTokens = {};
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
