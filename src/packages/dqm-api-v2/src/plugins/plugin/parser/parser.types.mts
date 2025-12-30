import type { DqmConfig } from "../../../config/dqm-config.types.mjs";
import type {
  IAstNode,
  IAstNodeContext,
} from "../../../nodes/ast/export.types.mjs";

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
  parse: ParseAstFunction;
}

export type ParseAstFunction = (
  raw: string,
  startRule: string,
  context: IAstNodeContext,
) => RankiLangParseFunctionReturn;

export interface RankiLangParseFunctionReturn {
  root: IAstNode;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
