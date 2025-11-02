import type * as ohm from "ohm-js";
import type {
  RankiLanguageConfig,
  RankiLanguageProvidedConfig,
} from "../lang/config.mjs";
// import type {
//   // RankiLangParseDefinition,
//   RankiLangParsedAst,
//   RankiLangAstContext,
// } from "../lang/context.mjs";
import type { RankiPluginCommon, WithTokenizer } from "./general.mjs";
import type { RankiPluginParserValidationCallback } from "../stages/validation.mjs";
import type { RankiPluginParserTransformCallback } from "../stages/transform.mjs";
// import type { RankiLangParseHandlerFunction } from "./grammar.type.mjs";
import type {
  ComponentPluginComponentStageAst,
  // RankiLangContextInstance,
  RankiLangParseDefinition,
} from "../export.mjs";

// export type RankiLangParseHandlerFunction =
//   // HandlerShape extends RankiLangParseDefinition = RankiLangParseDefinition,
//   (raw: string, context: RankiLangAstContext) => RankiLangParsedAst;

export type ParamParserReturn = {
  config: RankiLanguageProvidedConfig[];
} & Record<string, any>;

export type RankiPluginParser<
  ConfigShape = {},
  // HandlerShape extends RankiLangParseDefinition = RankiLangParseDefinition,
> = RankiPluginCommon &
  WithTokenizer & {
    type: "parser";
    // handler: RankiLangParseHandlerFunction;
    dependencies: string[];
    config: ConfigShape;
    paramParser: (
      // !FIX
      def: RankiLangParseDefinition,
      componentAst: ComponentPluginComponentStageAst,
      // context: RankiLangContextInstance,
    ) => ParamParserReturn;
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
