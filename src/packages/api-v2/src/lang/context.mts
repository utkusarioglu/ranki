import type { RankiLanguageConfig } from "./config.mjs";
import type { AstNode } from "../stages/ast.mjs";
import type {
  RankiLangInstance,
  RankiLangParseHandlerHooks,
  // RankiLangParserPluginParseHandler,
} from "./rankilang.mjs";
import {
  RankiGrammarTokens,
  RankiLangParseHandlerFunction,
  RankiPluginParser,
} from "../plugins/parser.mjs";
import type * as ohm from "ohm-js";
import type { TransformNode } from "../stages/transform.mjs";
import type { ValidationNode } from "../stages/validation.mjs";

export interface RankiLangParseResult {
  report: RankiLangParseReport;
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

interface RankiLangLanguageReport {}

export interface RankiLangAstResult {
  // report: RankiLangLanguageReport;
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

export interface RankiLangParsedAst {
  report: RankiLangAstReport;
  root: AstNode;
}

export interface RankiLangParsedTheater {
  stages: {
    raw: string;
    ast: RankiLangParsedAst;
    validation: ValidationNode;
    transform: TransformNode;
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

export type ProducedConfig = {
  config: Record<string, unknown>;
  tokens: Record<string, RankiGrammarTokens>;
};

export type ActionsDictRecord = Record<
  string,
  Record<string, ohm.ActionDict<any>>
>;

export interface ParserPluginsInstance {
  addPlugin(p: RankiPluginParser): void;
  getVersions(): VersionReport;
  produceConfig(): ProducedConfig;
  getHandler(handlerName: string): RankiLangParseHandlerFunction;
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
  plugin?: T;
  theater: TheaterName;
  role: RoleName;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
};

export type RankiLangParseSpecsFrameNull = RankiLangParseSpecsCommon;

export type RankiLangAstContext<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = RankiLangParseSpecs<T> & {
  hooks: RankiLangParseHandlerHooks;
};
// export type RankiLangAstContext = {
//   hooks: RankiLangParseHandlerHooks;
//   blockDepth: number;
//   inlineDepth: number;
//   theater: TheaterName;
//   role: RoleName;
//   // lang: RankiLangInstance;
//   startRule: string;
// };

export type VersionReport = Record<string, string>;
