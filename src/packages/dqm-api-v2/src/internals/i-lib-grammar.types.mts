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
  DependencyList,
  GrammarSet,
} from "../export.types.mjs";

export type ILibGrammarCriteria = {
  grammarNames: Set<PluginUrn<"grammar">>;
  config: DqmInternalConfig;
};

export type T = IDqmPluginGrammar;

export type ILibGrammar = IPluginLib<
  T,
  ILibGrammarGetReturn,
  ILibGrammarCriteria
> &
  ILibGrammarUnique;

interface ILibGrammarUnique {
  listMissing(set: GrammarSet): GrammarSet;
}

export interface ILibGrammarGetReturn {
  matcher: Grammar;
  semantics: Semantics;
  sorted: PluginUrn<"grammar">[];
  sources: OhmGrammarSource[];
  contributors: Contributors;
  methods: DqmParserGraphMethods;
  graphs: {
    specified: DependencyList;
    deduced: DependencyList;
  };
}

// export type GetMultipleReturn = {
//   graph: Record<PluginUrn<"grammar">, PluginUrn<"grammar">[]>;
//   sorted: PluginUrn<"grammar">[];
// };

export type GrammarActionsDict = Record<
  PluginUrn<"grammar">,
  ActionsDictRecord
>;
