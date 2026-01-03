import type {
  ActionsDictRecord,
  DqmPluginName,
  IDqmPluginGrammar,
  IPluginLib,
  PluginUrn,
} from "../export.types.mjs";

export type ILibGrammarCriteria = {
  grammarName: GrammarName;
};

export type T = IDqmPluginGrammar;

export type ILibGrammar = IPluginLib<
  T,
  IDqmPluginGrammar,
  ILibGrammarCriteria
> & {
  getActions(): GrammarActionsDict;
  getNames(): Set<GrammarName>;
  getMultiple(names: Set<GrammarName>): GetMultipleReturn;
};

export type GetMultipleReturn = {
  graph: Record<GrammarName, GrammarName[]>;
  sorted: PluginUrn[];
};

export type GrammarName = DqmPluginName & { subtype?: "GrammarName" };

export type GrammarActionsDict = Record<GrammarName, ActionsDictRecord>;
