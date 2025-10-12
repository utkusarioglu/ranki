import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import {
  RankiLangParseResult,
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
} from "../lang/context.mjs";
import { RankiLangParseHandlerHooks } from "../lang/rankilang.mjs";
import type { RankiPluginCommon } from "./general.mjs";

export type RankiGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type RankiLangParseHandlerFunction<
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = (
  raw: string,
  spec: RankiLangParseSpecs<HandlerShape>,
  hooks: RankiLangParseHandlerHooks,
) => RankiLangParseResult;

export type RankiPluginParser<
  ConfigShape = {},
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = RankiPluginCommon & {
  type: "parser";
  handler?: RankiLangParseHandlerFunction<HandlerShape>;
  dependencies: string[];
  config: ConfigShape;
  tokens: RankiGrammarTokens;
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
};

export interface RankiPluginParserSpecs {
  versionPath: string;
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}
