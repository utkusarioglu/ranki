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

interface FrameV1 {
  version: "v1";
  chain: string;
  params: string[];
}

// FIX This uses properties from the v2FrameConfig object.
// this type should be coming from the framev2 plugin. `api` shouldn't care about these things
interface FrameV2 {
  version: "v2";
  // chain: string[][];
  // directives: any; // !TODO any
  // settings: any; // !TODO any

  // version: "v2";
  variant: "fp_F"; // this is like f fp
  // args: Partial<NodeArgsBaseV2> & {
  //   "separator.right.type": string;
  //   // !FIX this value is inside the config structure, which breaks symmetry
  //   // "separator.left.type": string;
  //   "frame.v2.config": Partial<NodeArgsBaseV2>;
  // };
  params: any; // ParamsV2Spec;
}

interface RankiLangParseSpecsCommon {
  theater: TheaterName;
  role: RoleName;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
}

export type RankiLangParseSpecs =
  | RankiLangParseSpecsFrameNull
  | RankiLangParseSpecsFrameV1
  | RankiLangParseSpecsFrameV2;

export interface RankiLangParseSpecsFrameNull
  extends RankiLangParseSpecsCommon {}

export interface RankiLangParseSpecsFrameV1 extends RankiLangParseSpecsCommon {
  frame: FrameV1;
}
export interface RankiLangParseSpecsFrameV2 extends RankiLangParseSpecsCommon {
  frame: FrameV2;
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
