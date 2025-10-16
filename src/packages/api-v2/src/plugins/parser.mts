import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
} from "../lang/context.mjs";
import type { RankiLangParseHandlerHooks } from "../lang/rankilang.mjs";
import type { RankiPluginCommon } from "./general.mjs";
import type { RankiPluginParserValidationCallback } from "../stages/validation.mjs";
import type { RankiPluginParserTransformCallback } from "../stages/transform.mjs";

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
) => RankiLangParsedAst;

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
  validators: RankiPluginParserValidationCallback;
  transformers: RankiPluginParserTransformCallback;
};

export interface RankiPluginParserSpecs {
  versionPath: string;
  parentGrammar: string;
  dependencies: Record<string, ohm.Grammar>;
}
