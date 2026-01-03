import type { Grammar, Semantics } from "ohm-js";
import type {
  ActionsDictRecord,
  DqmInternalConfig,
  OhmGrammarSource,
  IDqmPluginGrammar,
  IPluginLib,
  PluginUrn,
  Contributors,
  DqmParserGraphMethods,
  DependencyGraph,
} from "../export.types.mjs";

export type ILibGrammarCriteria = {
  grammarNames: Set<PluginUrn<"grammar">>;
  config: DqmInternalConfig;
};

export type T = IDqmPluginGrammar;

export type ILibGrammar = IPluginLib<T, NewGetReturn, ILibGrammarCriteria> & {
  // getActions(): GrammarActionsDict;
  getNames(): Set<PluginUrn<"grammar">>;
  // getMultiple(names: Set<PluginUrn<"grammar">>): GetMultipleReturn;
  // newGet(s: Set<PluginUrn<"grammar">>): NewGetReturn;

  getSingle(grammarName: PluginUrn<"grammar">): IDqmPluginGrammar;
};

export interface NewGetReturn {
  matcher: Grammar;
  semantics: Semantics;
  sorted: PluginUrn<"grammar">[];
  sources: OhmGrammarSource[];
  contributors: Contributors;
  methods: DqmParserGraphMethods;
  graph: DependencyGraph;
}

export type GetMultipleReturn = {
  graph: Record<PluginUrn<"grammar">, PluginUrn<"grammar">[]>;
  sorted: PluginUrn<"grammar">[];
};

export type GrammarActionsDict = Record<
  PluginUrn<"grammar">,
  ActionsDictRecord
>;
