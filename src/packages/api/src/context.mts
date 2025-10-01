import type { RankiLanguageConfig } from "./config.mjs";
import type { AstNode } from "./ast-node.mjs";
import type { RankiLangInstance } from "./rankilang.mjs";

export interface RankiLangParseResult {
  report: RankiLangParseReport;
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

export interface RankiLangParseReport {
  language: {
    versions: VersionReport;
  };
  config: RankiLanguageConfig;
  theater: TheaterName;
  role: RoleName;
}

export interface RankiLangParsedTheater {
  stages: {
    raw: string;
    ast: {
      report: RankiLangAstReport;
      root: AstNode;
    };
  };
}

export interface RankiLangAstReport {
  parser: {
    requested: string[];
    sorted: string[];
    graph: Record<string, string[]>;
    contributors: Record<string, string[]>;
    methods: Record<string, string[]>;
  };
}
export interface RankiLangParseFunctionReturn {
  report: RankiLangAstReport;
  root: RankiLangParsedTheater["stages"]["ast"]["root"];
}

export type ParserPlugins = any; // !TODO any

export type TheaterName = string & { type?: "TheaterName" };
type RoleName = string & { type?: "RoleName" };

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
  theater: TheaterName;
  role: RoleName;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
}

export type RankiLangAstContext = {
  blockDepth: number;
  inlineDepth: number;
  theater: TheaterName;
  role: RoleName;
  lang: RankiLangInstance;
  startRule: string;
};

export type VersionReport = Record<string, string>;
