import type {
  ActionsDictRecord,
  DqmAstReport,
  DqmConfig,
  DqmPluginName,
  IAstNode,
  IAstNodeContext,
  IDqmPluginGrammar,
} from "../export.types.mjs";

// export interface IParser {
//   parse(): this;
// }

export interface IParser {
  // parse: ParseAstFunction;
  getReport(): DqmAstReport | null;
  parse(
    raw: string,
    startRule: string,
    context: IAstNodeContext,
  ): RankiLangParseFunctionReturn;
}

// export type ParseAstFunction = (
//   raw: string,
//   startRule: string,
//   context: IAstNodeContext,
// ) => RankiLangParseFunctionReturn;
export type ParseAstFunction = IParser["parse"];

export interface RankiLangParseFunctionReturn {
  root: IAstNode;
}

export type IParserConstructor = new (
  hash: ParserHashString,
  config: DqmConfig,
  hooks: IParserConstructorHooks,
) => IParser;

export type IParserConstructorHooks = {
  getGrammar: (g: GrammarName) => IDqmPluginGrammar;
  namesSet: () => Set<GrammarName>;
  getActions: () => GrammarActionsDict;
};

export type ParserHashString = string & { type?: "ParserHash" };

// GRAMMAR
export type GrammarName = DqmPluginName & { subtype?: "GrammarName" };

export type GrammarActionsDict = Record<GrammarName, ActionsDictRecord>;
