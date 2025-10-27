import type { RankiGrammarTokens } from "@ranki/package-api-v2";
import type { RankiFrameV2ParserPluginConfig } from "./types/config.mjs";
export declare const config: RankiFrameV2ParserPluginConfig;
export declare function tokenizer(config: RankiFrameV2ParserPluginConfig): RankiGrammarTokens;
