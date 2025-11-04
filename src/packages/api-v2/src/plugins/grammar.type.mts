import type * as ohm from "ohm-js";
import type { RankiLanguageConfig } from "../lang/config.mjs";
import type {
  // RankiLangParseDefinition,
  // RankiLangParsedAst,
  RankiLangParseFunctionReturn,
  RankiLangAstContext,
  RankiLangParseDefinition,
  // RankiLangParseDefinition,
} from "../lang/context.type.mjs";
import type { RankiPluginCommon, WithTokenizer } from "./general.mjs";
import type { RankiPluginParserValidationCallback } from "../stages/validation.mjs";
import type { RankiPluginParserTransformCallback } from "../stages/transform.mjs";
import type {
  ComponentPluginComponent,
  CreateParserReturn,
} from "../export.mjs";

export type RankiGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;

export type RankiLangParseHandlerFunctionParams = {
  raw: string;
  context: RankiLangAstContext;
  // parser: CreateParserReturn;
  component: ComponentPluginComponent;
  createParser: (
    parseHandlerDef: RankiLangParseDefinition,
    context: RankiLangAstContext,
  ) => CreateParserReturn;
  definition: RankiLangParseDefinition;
};

export type RankiLangParseHandlerFunction = (
  params: RankiLangParseHandlerFunctionParams,
) => RankiLangParseFunctionReturn;

// export type RankiLangParseHandlerFunctionReturn = RankiLangParseFunctionReturn;
// props: any;
// ast: RankiLangParseFunctionReturn;
// };

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
