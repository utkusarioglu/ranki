import type { RankiLanguageConfig } from "./config.mjs";
import type { AstNode } from "../stages/ast.mjs";
import type { RankiLangParseHandlerHooks } from "./rankilang.mjs";
import {
  RankiLangParseHandlerFunction,
  RankiPluginParser,
} from "../plugins/parser.mjs";
import { RankiGrammarTokens } from "../plugins/grammar.mjs";
import type * as ohm from "ohm-js";
import type { TransformNode } from "../stages/transform.mjs";
import type { ValidationNode } from "../stages/validation.mjs";

export interface RankiLangParseResult {
  report: RankiLangParseReport;
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

export interface RankiLangAstResult {
  theaters: {
    [key: string]: RankiLangParsedTheater;
  };
}

export interface RankiLangParseReport {
  language: {
    versions: VersionReport;
  };
  ast: RankiLangConsolidatedAstReport;
  theater: TheaterName;
  role: RoleName;
}

export interface RankiLangConsolidatedAstReport {
  count: number;
  list: RankiLangAstReport[];
}

export type RankiLangParsedAst = RankiLangParseFunctionReturn;

export interface RankiLangParsedTheater {
  stages: {
    raw: string;
    ast: RankiLangParsedAst;
    validation: ValidationNode;
    transform: TransformNode;
  };
}

export interface RankiLangAstReport {
  cache: {
    hash: string;
    usageCount: number;
  };
  graph: {
    requested: string[];
    sorted: string[];
    dependencies: Record<string, string[]>;
    contributors: Record<string, string[]>;
    methods: Record<string, string[]>;
  };
  grammar: {
    source: string;
  };
  config: RankiLanguageConfig;
}

export interface RankiLangParseFunctionReturn {
  root: AstNode;
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

export type RankiLangParseSpecs = {
  theater: TheaterName;
  role: RoleName;
};

export type RankiLangParseSpecsFrameNull = RankiLangParseSpecsCommon;

export type RankiLangAstContext<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> = RankiLangParseSpecs & {
  parser: T;
  astHash: string;
  hooks: RankiLangParseHandlerHooks;
  blockDepth: number;
  inlineDepth: number;
  startRule: string;
};

export type VersionReport = Record<string, string>;
