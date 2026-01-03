import type {
  DqmConfig,
  DqmPluginParserName,
} from "../../../config/dqm-config.types.mjs";
import type {
  IDqmPluginGrammar,
  ParserHashString,
  PluginUrn,
} from "../../../export.types.mjs";

export type PluginDictionary = Record<PluginUrn<"grammar">, IDqmPluginGrammar>;

export type DependencyList = Record<
  PluginUrn<"grammar">,
  PluginUrn<"grammar">[]
>;

export type GrammarDictSet = Record<PluginUrn<"grammar">, GrammarSet>;
export type GrammarMapSet = Map<PluginUrn<"grammar">, GrammarSet>;

export type GrammarSet = Set<PluginUrn<"grammar">>;
export type GrammarList = PluginUrn<"grammar">[];

export type Contributors = Record<string, string[]>;

export type DqmParserGraphMethods = Record<string, string[]>;

export type OhmGrammarSource = string & { type?: "OhmGrammarSource" };

export interface DqmAstReport {
  cache: {
    hash: ParserHashString;
    usageCount: number;
  };
  grammar: {
    standards: DqmPluginParserName[];
    requested: DqmPluginParserName[];
    sorted: DqmPluginParserName[];
    graphs: {
      specified: DependencyList;
      deduced: DependencyList;
    };
    contributors: Contributors;
    methods: DqmParserGraphMethods;
    sources: OhmGrammarSource[];
  };
  config: DqmConfig;
}

export interface DqmConsolidatedAstReport {
  count: number;
  list: DqmAstReport[];
}
