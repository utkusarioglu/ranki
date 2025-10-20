import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  RankiLangParseSpecs,
  RankiLangParseHandlerCommon,
  RankiLangParsedAst,
  RankiLangAstContext,
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
  spec: RankiLangAstContext<HandlerShape>,
  // hooks: RankiLangParseHandlerHooks,
) => RankiLangParsedAst;

export type RankiPluginGrammar<
  ConfigShape = {},
  // HandlerShape extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = RankiPluginCommon & {
  type: "grammar";
  // handler: RankiLangParseHandlerFunction<HandlerShape>;
  dependencies: string[];
  config: ConfigShape;
  tokens: RankiGrammarTokens;
  grammar: (c: RankiLanguageConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
  validators: RankiPluginParserValidationCallback;
  transformers: RankiPluginParserTransformCallback;
};

// export interface RankiPluginParserSpecs {
//   versionPath: string;
//   parentGrammar: string;
//   dependencies: Record<string, ohm.Grammar>;
// }
