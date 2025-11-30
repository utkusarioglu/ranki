import * as ohm from "ohm-js";
import type { DqmConfig } from "../../dqm-config.types.mjs";
import type { CpsDefinition } from "../export.types.mjs";

export interface IDqmPluginGrammar<ConfigShape = {}> {
  type: "grammar";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  dependencies: string[];
  config: (parentConfig: DqmConfig) => ConfigShape;
  grammar: (config: DqmConfig) => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
  // TODO
  // validators:
}

export interface DqmAstReport {
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
  config: DqmConfig;
}

export interface CreateParserReturn {
  expandedDefinition: CpsDefinition & { hash: string };
  callback: ParseAstFunction;
}

export type ParseAstFunction = (
  raw: string,
  // context: RankiLangContextInstance,
) => RankiLangParseFunctionReturn;

export interface RankiLangParseFunctionReturn {
  props: Record<string, any>;
  root: IAstNode;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}

export interface IAstNode {}
