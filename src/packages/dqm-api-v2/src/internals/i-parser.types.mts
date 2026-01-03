import type { IAstNode, IAstNodeContext } from "../export.types.mjs";

export interface IParser {
  parse(): this;
}

export interface CreateParserReturn {
  parse: ParseAstFunction;
}

export type ParseAstFunction = (
  raw: string,
  startRule: string,
  context: IAstNodeContext,
) => RankiLangParseFunctionReturn;

export interface RankiLangParseFunctionReturn {
  root: IAstNode;
}
