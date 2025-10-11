import type { RankiLanguageConfig } from "./config.mjs";
import type { AstNode } from "./ast-node.mjs";
import type {
  RankiLangInstance,
  RankiLangParserPluginParseHandler,
} from "./rankilang.mjs";
import { RankiPluginParser } from "./plugin.mjs";
import type * as ohm from "ohm-js";

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

export type ProducedConfig = Record<string, unknown>;

export type ActionsDictRecord = Record<
  string,
  Record<string, ohm.ActionDict<any>>
>;

export interface ParserPluginsInstance {
  getVersions(): VersionReport;
  produceConfig(): ProducedConfig;
  getHandler(handlerName: string): RankiLangParserPluginParseHandler;
  checkMissing(set: Set<string>): string[];
  pickPlugins(set: Set<string>): RankiPluginParser[];
  sortPlugins(activePluginsArr: RankiPluginParser[]): string[];
  dependencyGraph(
    activePluginsArr: RankiPluginParser[],
  ): Record<
    RankiPluginParser["meta"]["name"],
    RankiPluginParser["meta"]["name"][]
  >;
  getActions(): ActionsDictRecord;
  find(name: string): RankiPluginParser;
}

export type TheaterName = string & { type?: "TheaterName" };
type RoleName = string & { type?: "RoleName" };

// FIX This uses properties from the v2FrameConfig object.
// this type should be coming from the framev2 plugin. `api` shouldn't care about these things

interface RankiLangParseSpecsCommon {
  theater: TheaterName;
  role: RoleName;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
}

export interface RankiLangParseHandlerCommon {
  type: string;
}

export type RankiLangParseSpecs<T extends RankiLangParseHandlerCommon> = {
  // plugin?: FrameV1 | FrameV2;
  plugin?: T;
  theater: TheaterName;
  role: RoleName;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
};
// | RankiLangParseSpecsFrameNull
// | RankiLangParseSpecsFrameV1
// | RankiLangParseSpecsFrameV2;

export type RankiLangParseSpecsFrameNull = RankiLangParseSpecsCommon;

// export interface RankiLangParseSpecsFrameV1 extends RankiLangParseSpecsCommon {
//   plugin: FrameV1;
// }
// export interface RankiLangParseSpecsFrameV2 extends RankiLangParseSpecsCommon {
//   plugin: FrameV2;
// }

export type RankiLangAstContext = {
  blockDepth: number;
  inlineDepth: number;
  theater: TheaterName;
  role: RoleName;
  lang: RankiLangInstance;
  startRule: string;
};

export type VersionReport = Record<string, string>;
