import type {
  DqmConfig,
  DqmPluginParserName,
} from "../../../config/dqm-config.types.mjs";
import type { ParserHashString, PluginUrn } from "../../../export.types.mjs";

export type DependencyGraph = Record<
  PluginUrn<"grammar">,
  PluginUrn<"grammar">[]
>;

export type Contributors = Record<string, string[]>;

export type DqmParserGraphMethods = Record<string, string[]>;

export type OhmGrammarSource = string & { type?: "OhmGrammarSource" };

export interface DqmAstReport {
  cache: {
    hash: ParserHashString;
    usageCount: number;
  };
  graph: {
    standards: DqmPluginParserName[];
    requested: DqmPluginParserName[];
    sorted: DqmPluginParserName[];
    dependencies: DependencyGraph;
    contributors: Contributors;
    methods: DqmParserGraphMethods;
  };
  grammar: {
    source: OhmGrammarSource;
  };
  config: DqmConfig;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
