import type { DqmGrammarTokens } from "@ranki/package-dqm-api-v2";
import type { BaseV2GrammarConfig } from "./base-v2.types.mjs";

export function tokenizer(config: BaseV2GrammarConfig) {
  const tokens: DqmGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  tokens["tBaseV2Ignore"] = config.tokens.ignore;
  return tokens;
}
