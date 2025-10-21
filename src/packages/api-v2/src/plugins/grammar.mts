import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
  RankiLangAstContext,
} from "../lang/context.mjs";
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
  spec: RankiLangAstContext<HandlerShape>,
) => RankiLangParsedAst;

export type RankiPluginGrammar<ConfigShape = {}> = RankiPluginCommon & {
  type: "grammar";
  dependencies: string[];
  config: ConfigShape;
  tokens: RankiGrammarTokens;
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
  validators: RankiPluginParserValidationCallback;
  transformers: RankiPluginParserTransformCallback;
};
