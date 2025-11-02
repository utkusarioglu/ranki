import type { RankiPluginParser } from "./parser.mjs";
import type { RankiGrammarTokens } from "./grammar.type.mjs";

export type RankiPlugin = RankiPluginParser;

export type RankiPluginCommon = {
  meta: RankiPluginMeta;
};

export interface RankiPluginMeta {
  version: string; // semver
  name: string;
}

export type WithTokenizer = {
  tokenizer: () => RankiGrammarTokens;
};
