import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  // RankiLangParseHandler,
  RankiLangParsedAst,
  RankiLangAstContext,
} from "../lang/context.mjs";
import type { RankiPluginCommon, WithTokenizer } from "./general.mjs";
import type { RankiPluginParserValidationCallback } from "../stages/validation.mjs";
import type { RankiPluginParserTransformCallback } from "../stages/transform.mjs";

export type RankiGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type RankiLangParseHandlerFunction<
  // HandlerShape extends RankiLangParseHandler = RankiLangParseHandler,
> = (raw: string, spec: RankiLangAstContext) => RankiLangParsedAst;

export type RankiPluginGrammar<ConfigShape = {}> = RankiPluginCommon &
  WithTokenizer & {
    type: "grammar";
    dependencies: string[];
    config: ConfigShape;
    grammar: (c: RankiLanguageConfig) => string;
    actions: () => Record<string, ohm.ActionDict<unknown>>;
    validators: RankiPluginParserValidationCallback;
    transformers: RankiPluginParserTransformCallback;
  };
