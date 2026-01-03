import type {
  ActionsDictRecord,
  IDqmPluginGrammar,
  IPluginLib,
  PluginUrn,
} from "../export.types.mjs";

export type ILibGrammarCriteria = {
  grammarName: PluginUrn<"grammar">;
};

export type T = IDqmPluginGrammar;

export type ILibGrammar = IPluginLib<
  T,
  IDqmPluginGrammar,
  ILibGrammarCriteria
> & {
  getActions(): GrammarActionsDict;
  getNames(): Set<PluginUrn<"grammar">>;
  getMultiple(names: Set<PluginUrn<"grammar">>): GetMultipleReturn;
};

export type GetMultipleReturn = {
  graph: Record<PluginUrn<"grammar">, PluginUrn<"grammar">[]>;
  sorted: PluginUrn<"grammar">[];
};

export type GrammarActionsDict = Record<
  PluginUrn<"grammar">,
  ActionsDictRecord
>;
