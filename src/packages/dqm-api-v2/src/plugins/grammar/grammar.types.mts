import * as ohm from "ohm-js";
import type { DqmConfig } from "../../dqm-config.types.mjs";
import type { ICps, ICpx } from "../../cpx.types.mjs";

export interface IDqmPluginGrammar<ConfigShape = {}> {
  type: "grammar";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  dependencies: string[];
  tokenizer: () => DqmGrammarTokens;
  config: (defaultConfig: DqmConfig) => ConfigShape;
  grammar: (config: DqmConfig) => string;
  actions: () => ActionsDictRecord;
  // TODO
  // validators:
}

export type ActionsDictRecord = Record<
  string,
  Record<string, ohm.ActionDict<any>>
>;

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
  // expandedDefinition: CpsDefinition & { hash: string };
  parse: ParseAstFunction;
}

export type ParseAstFunction = (
  raw: string,
  startRule: string,
  context: {
    cpx: ICpx;
    cps: ICps;
    // ast: IAstNode;
  },
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

export type DqmGrammarTokens = Record<
  string,
  boolean | number | string | string[]
>;
