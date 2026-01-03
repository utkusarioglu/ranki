import type {
  DqmConfig,
  DqmPluginParserName,
} from "../../../config/dqm-config.types.mjs";
import type { GrammarName, ParserHashString } from "../../../export.types.mjs";

export type DependencyGraph = Record<GrammarName, GrammarName[]>;

export type Contributors = Record<string, string[]>;

export type DqmParserGraphMethods = Record<string, string[]>;

export type DqmSource = string & { type?: "DqmSource" };

export interface DqmAstReport {
  cache: {
    hash: ParserHashString;
    usageCount: number;
  };
  graph: {
    requested: DqmPluginParserName[];
    sorted: DqmPluginParserName[];
    dependencies: DependencyGraph;
    contributors: Contributors;
    methods: DqmParserGraphMethods;
  };
  grammar: {
    source: DqmSource;
  };
  config: DqmConfig;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
