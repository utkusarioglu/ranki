import type {
  RankiLanguageConfig,
  RankiLanguageContextConfig,
} from "./config.mjs";
import type { ParseNode } from "./parse.mjs";

export interface ParseContext {
  config: RankiLanguageConfig;
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
  config: RankiLanguageContextConfig,
  parserPlugins: any, // !FIX any,
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
