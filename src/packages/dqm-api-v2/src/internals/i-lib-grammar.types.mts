import type {
  ActionsDictRecord,
  DqmPluginName,
  IDqmPluginGrammar,
  IPluginLib,
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
};

export type GrammarName = DqmPluginName & { subtype?: "GrammarName" };

export type GrammarActionsDict = Record<GrammarName, ActionsDictRecord>;
