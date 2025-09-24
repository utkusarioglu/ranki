import type { RankiConfig } from "./config.mjs";
import type { ParseNode } from "./parse.mjs";

export interface ParseContext extends RankiConfig {
  methods: {
    parser: ParserGenerator;
  };
}

interface ParserGeneratorParams {
  frameType: string;
}

type ParserGenerator = (p: ParserGeneratorParams) => ParserFunction;

type ParserFunction = (
  context: ParseContext,
  plugins: string[],
  raw: string,
) => ParseResult;

interface ParseResult {
  report: {
    language: {
      version: string;
    };
  };
  stages: {
    raw: string;
    parse: {
      root: ParseNode;
    };
  };
}
