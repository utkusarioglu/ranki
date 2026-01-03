import type {
  DqmAstReport,
  DqmConfig,
  IAstNode,
  IAstNodeContext,
  ILibGrammar,
} from "../export.types.mjs";

export interface IParser {
  getReport(): DqmAstReport | null;
  parse(
    raw: string,
    startRule: string,
    context: IAstNodeContext,
  ): RankiLangParseFunctionReturn;
}

export type ParseAstFunction = IParser["parse"];

export interface RankiLangParseFunctionReturn {
  root: IAstNode;
}

export type IParserConstructor = new (
  hash: ParserHashString,
  config: DqmConfig,
  grammarLib: ILibGrammar,
) => IParser;

export type ParserHashString = string & { type?: "ParserHash" };
