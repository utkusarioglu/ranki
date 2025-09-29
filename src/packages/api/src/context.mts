import type {
  RankiLanguageConfig,
  RankiLanguageContextConfig,
} from "./config.mjs";
import type { ParseNode } from "./parse.mjs";

// export interface ParseContext {
//   config: RankiLanguageConfig;
//   methods: {
//     parser: ParserGenerator;
//     parserPlugins: any;
//   };
// }

// interface ParserGeneratorParams {
//   frameType: string;
// }

// type ParserGenerator = (p: ParserGeneratorParams) => ParserFunction;

// type ParserFunction = (context: ParseContext, raw: string) => ParseResult;

// export type CreateContextFunction = (
//   config: RankiLanguageContextConfig,
//   parserPlugins: any, // !FIX any,
// ) => ParseContext;

// export type VersionReport = Record<string, string>;

// interface ParseResult {
//   report: {
//     language: {
//       versions: VersionReport;
//     };
//   };
//   stages: {
//     raw: string;
//     parse: {
//       root: ParseNode;
//     };
//   };
// }

export interface RankiLangParseResult {
  report: {
    language: {
      versions: VersionReport;
    };
    parser: {
      requested: string[];
      importChain: string[];
      dependencyGraph: Record<string, string[]>;
    };
    config: RankiLanguageConfig;
  };
  stages: {
    raw: string;
    parse: {
      participants: Record<string, string[]>;
      methods: Record<string, string[]>;
      root: ParseNode;
    };
  };
}

type ParserPlugins = any; // !TODO any

export interface RankiLangInstance {
  // new (
  //   contextConfig: RankiLanguageContextConfig,
  //   plugins: ParserPlugins,
  // ): RankiLangInstance;
  getPlugins(): ParserPlugins;
  getConfig(): RankiLanguageConfig;
  parse(raw: string, specs: RankiLangParseSpecs): RankiLangParseResult;
  create(
    contextConfig: RankiLanguageContextConfig | null,
    plugins: ParserPlugins | null,
  ): RankiLangInstance;
}

interface FrameNull {
  type: "null";
}

interface FrameV1 {
  version: "v1";
  type: string;
  params: string[];
}

interface FrameV2 {
  version: "v2";
  type: string;
  directives: any; // !TODO any
  params: any; // !TODO any
}

export interface RankiLangParseSpecs {
  frame?: FrameNull | FrameV1 | FrameV2;
  // frameType: string;
  // plugins: any; // !TODO any
}

export type RankiLangParseContext = RankiLangInstance;
// export interface RankiLangParseContext {
//   config: RankiLanguageConfig;
//   lang: RankiLangInstance;
// }

// interface RankiLangParseResult {
//   report: {
//     language: {
//       versions: VersionReport;
//     };
//   };
//   stages: {
//     raw: string;
//     parse: {
//       root: ParseNode;
//     };
//   };
// }

export type VersionReport = Record<string, string>;
