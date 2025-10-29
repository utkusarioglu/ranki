import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  // RankiLangParseDefinition,
  RankiLangParsedAst,
  RankiLangAstContext,
} from "../lang/context.mjs";
import type { RankiPluginCommon, WithTokenizer } from "./general.mjs";
import type { RankiPluginParserValidationCallback } from "../stages/validation.mjs";
import type { RankiPluginParserTransformCallback } from "../stages/transform.mjs";
import type { CreateParserReturn } from "../export.mjs";

export type RankiGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type RankiLangParseHandlerFunction = (
  raw: string,
  spec: RankiLangAstContext,
  parser: CreateParserReturn,
) => RankiLangParseHandlerFunctionReturn;

export type RankiLangParseHandlerFunctionReturn = {
  props: any;
  ast: RankiLangParsedAst;
};

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
