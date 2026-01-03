import type { DqmConfig } from "../../../config/dqm-config.types.mjs";

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

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
