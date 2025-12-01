import type {
  DqmConfig,
  ICpx,
  ICps,
  IAstNode,
} from "../../../export.types.mjs";

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
  },
) => RankiLangParseFunctionReturn;

export interface RankiLangParseFunctionReturn {
  // props: Record<string, any>;
  root: IAstNode;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
