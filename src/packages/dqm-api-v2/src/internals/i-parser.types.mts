import type { IAstNode, IAstNodeContext } from "../export.types.mjs";

// export interface IParser {
//   parse(): this;
// }

export interface IParser {
  // parse: ParseAstFunction;
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

export type IParserConstructor = new () => IParser;
