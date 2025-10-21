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

import type { RankiGrammarTokens } from "./grammar.mjs";

export type RankiLangParseHandlerFunction<
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = (
  raw: string,
  context: RankiLangAstContext<HandlerShape>,
) => RankiLangParsedAst;

export type RankiPluginParser<
  ConfigShape = {},
  HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = RankiPluginCommon & {
  type: "parser";
  handler: RankiLangParseHandlerFunction<HandlerShape>;
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
