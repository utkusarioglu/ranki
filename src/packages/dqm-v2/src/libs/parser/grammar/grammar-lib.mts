import type {
  IDqmPluginGrammar,
  GrammarActionsDict,
  DqmConfig,
  DqmPluginsTokens,
  ILibGrammar,
  ILibGrammarCriteria,
  PluginUrn,
  ILibGrammarGetReturn,
  DependencyList,
  PluginDictionary,
  GrammarSet,
  DqmGrammarPluginsAggregatedConfig,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";
import { GrammarPluginUtils } from "./grammar-plugin-utils.mjs";
import { OhmGrammar } from "./ohm-grammar.mjs";
import { Serialize } from "../../../utils/serialize.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import { PluginFilter } from "../../../utils/plugin.mjs";

export class GrammarLib implements ILibGrammar {
  private grammars = new Map<PluginUrn<"grammar">, IDqmPluginGrammar>();

  listMissing(set: GrammarSet): GrammarSet {
    const missing = new Set(set);
    for (let p of set) {
      if (this.grammars.has(p)) {
        missing.delete(p);
      }
    }
    return missing;
  }

  getGrammarDefaultConfigs(
    defaultConfig: DqmConfig,
  ): DqmGrammarPluginsAggregatedConfig {
    return Object.fromEntries(
      this.grammars.entries().map(([k, v]) => [k, v.config(defaultConfig)]),
    );
  }

  getGrammarTokens(config: DqmConfig): DqmPluginsTokens {
    return Object.fromEntries(
      this.grammars
        .values()
        .map((c) => {
          const key = Serialize.grammarName(c);
          const tokens = config.plugins.config[key];
          const tokenized = tokens === undefined ? null : c.tokenizer(tokens);
          return [key, tokenized];
        })
        .filter((a) => a[1] !== null),
    );
  }

  add(plugin: IDqmPluginGrammar): this {
    const key = Serialize.grammarName(plugin);
    if (this.grammars.has(key)) {
      throw new DqmAppError({
        code: "PLUGIN_GRAMMAR_REGISTERED",
        why: "Plugin names have to be unique",
        cause: null,
        details: {
          list: this.grammars,
          plugin,
        },
      });
    }
    this.grammars.set(key, plugin);
    return this;
  }

  get({ grammarNames, config }: ILibGrammarCriteria): ILibGrammarGetReturn {
    const plugins = this.collectPlugins(grammarNames);
    const specifiedGraph = this.buildGraph(plugins);
    const sorted = GrammarPluginUtils.sort(plugins);
    const { matcher, sources } = OhmGrammar.build(plugins, sorted, config);
    const deducedGraph = this.buildGraph(plugins);
    const actions = this.collectActions();
    const { semantics, contributors, methods } = OhmGrammar.compileActionDicts(
      matcher,
      grammarNames,
      actions,
    );

    return {
      graphs: {
        specified: specifiedGraph,
        deduced: deducedGraph,
      },
      matcher,
      semantics,
      sorted,
      sources,
      contributors,
      methods,
    };
  }

  @rejectValues(undefined)
  private getPlugin(grammarName: PluginUrn<"grammar">): IDqmPluginGrammar {
    return this.grammars.get(grammarName)!;
  }

  private collectPlugins(set: GrammarSet): PluginDictionary {
    return Object.fromEntries(
      Array.from(set).map((grammarName) => [
        grammarName,
        this.getPlugin(grammarName),
      ]),
    );
  }

  private buildGraph(dict: PluginDictionary): DependencyList {
    return Object.fromEntries(
      Object.entries(dict).map(([n, v]) => [
        n,
        PluginFilter.grammars(v.dependencies),
      ]),
    );
  }

  private collectActions(): GrammarActionsDict {
    return Object.fromEntries(
      this.grammars
        .values()
        .map((g) => [Serialize.grammarName(g), g.actions()]),
    );
  }
}
