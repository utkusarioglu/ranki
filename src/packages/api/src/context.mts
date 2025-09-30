import type {
  RankiLanguageConfig,
  RankiLanguageContextConfig,
} from "./config.mjs";
import type { ParseNode } from "./parse.mjs";

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
  parser: {
    requested: string[];
    sorted: string[];
    graph: Record<string, string[]>;
    contributors: Record<string, string[]>;
    methods: Record<string, string[]>;
  };
  config: RankiLanguageConfig;
}

export interface RankiLangParsedTheater {
  stages: {
    raw: string;
    parse: {
      root: ParseNode;
    };
  };
}

export interface RankiLangParseFunctionReturn {
  report: RankiLangParseReport;
  parsed: RankiLangParsedTheater["stages"]["parse"]["root"];
}

type ParserPlugins = any; // !TODO any

type TheaterName = string & { type?: "TheaterName" };
type RoleName = string & { type?: "RoleName" };

export interface RankiLangInstance {
  getPlugins(): ParserPlugins;
  getConfig(): RankiLanguageConfig;
  parse(
    raw: Record<TheaterName, string>,
    specs: RankiLangParseSpecs,
  ): RankiLangParseResult;
  clone(
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
  theater: TheaterName;
  role: RoleName;
  // totalDepth: number;
  blockDepth: number;
  inlineDepth: number;
  // frameType: string;
  // plugins: any; // !TODO any
}

export type RankiLangParseContext = {
  // totalDepth: number;
  blockDepth: number;
  inlineDepth: number;
  theater: TheaterName;
  role: RoleName;
  lang: RankiLangInstance;
};

export type VersionReport = Record<string, string>;
