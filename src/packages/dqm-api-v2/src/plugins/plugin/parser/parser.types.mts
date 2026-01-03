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

export type DqmSource = string & { type?: "DqmSource" };

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
    source: DqmSource;
  };
  config: DqmConfig;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
