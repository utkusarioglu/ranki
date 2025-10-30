import type { RankiGrammarTokens } from "@ranki/package-api-v2";
import type { RankiBaseV2ParserPluginConfig } from "./type.mjs";

export function tokenizer(config: RankiBaseV2ParserPluginConfig) {
  const tokens: RankiGrammarTokens = {};
  tokens["tBaseV2Escape"] = config.tokens.escape;
  tokens["tBaseV2Ignore"] = config.tokens.ignore;
  return tokens;
}
