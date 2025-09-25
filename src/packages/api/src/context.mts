import type { RankiConfig } from "./config.mjs";
import type { ParseNode } from "./parse.mjs";

export interface ParseContext {
  config: RankiConfig;
  methods: {
    parser: ParserGenerator;
    parserPlugins: any;
  };
}

interface ParserGeneratorParams {
  frameType: string;
}

type ParserGenerator = (p: ParserGeneratorParams) => ParserFunction;

type ParserFunction = (context: ParseContext, raw: string) => ParseResult;

export type CreateContextFunction = (
  config: RankiConfig,
  parser: ParserFunction,
  parserPlugins: any,
) => ParseContext;

export type VersionReport = Record<string, string>;

interface ParseResult {
  report: {
    language: {
      versions: VersionReport;
    };
  };
  stages: {
    raw: string;
    parse: {
      root: ParseNode;
    };
  };
}
