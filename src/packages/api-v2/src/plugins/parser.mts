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

export type RankiLangParseHandlerFunction =
  // HandlerShape extends RankiLangParseHandler = RankiLangParseHandler,
  (raw: string, context: RankiLangAstContext) => RankiLangParsedAst;

export type RankiPluginParser<
  ConfigShape = {},
  // HandlerShape extends RankiLangParseHandler = RankiLangParseHandler,
> = RankiPluginCommon &
  WithTokenizer & {
    type: "parser";
    handler: RankiLangParseHandlerFunction;
    dependencies: string[];
    config: ConfigShape;
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
