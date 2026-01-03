import type {
  IDqmPluginGrammar,
  GrammarActionsDict,
  DqmConfig,
  DqmPluginsConfigDefaults,
  DqmPluginsTokens,
  ILibGrammar,
  ILibGrammarCriteria,
  GetMultipleReturn,
  PluginUrn,
  NewGetReturn,
} from "@dqm/package-dqm-api-v2";
import { rejectValues } from "@dqm/package-dqm-utils";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { Serialize } from "../../utils/serialize.mjs";
import { expandDependencies, topologicalSort } from "./utils.mjs";
import { PluginFilter } from "../../utils/plugin.mjs";
import { OhmGrammar } from "./ohm-grammar.mjs";

export class GrammarLib implements ILibGrammar {
  private grammars = new Map<PluginUrn<"grammar">, IDqmPluginGrammar>();

  private getActions(): GrammarActionsDict {
    return Object.fromEntries(
      this.grammars
        .values()
        .map((g) => [Serialize.grammarName(g), g.actions()]),
    );
  }

  getNames(): Set<PluginUrn<"grammar">> {
    return new Set<PluginUrn<"grammar">>(this.grammars.keys());
  }

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    const config = Object.fromEntries(
      this.grammars.entries().map(([k, v]) => [k, v.config(defaultConfig)]),
    );
    return {
      config,
    };
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

  @rejectValues(undefined)
  getSingle(grammarName: PluginUrn<"grammar">): IDqmPluginGrammar {
    return this.grammars.get(grammarName)!;
  }

  get({ grammarNames, config }: ILibGrammarCriteria): NewGetReturn {
    const { sorted, graph } = this.getMultiple(grammarNames);
    const { matcher, sources } = OhmGrammar.build(sorted, config, this);

    const actions = this.getActions();
    const {
      semantics,
      contributors: contributors,
      methods,
    } = OhmGrammar.compileActionDicts(matcher, grammarNames, actions);

    return {
      matcher,
      semantics,
      sorted,
      sources,
      graph,
      contributors,
      methods,
    };
  }

  private getMultiple(names: Set<PluginUrn<"grammar">>): GetMultipleReturn {
    const activePluginsArr = this.pickPlugins(names);
    const importChain = this.sortPlugins(activePluginsArr);
    const dependencyGraph = this.dependencyGraph(activePluginsArr);
    return {
      sorted: importChain,
      graph: dependencyGraph,
    };
  }

  private pickPlugins(set: Set<PluginUrn<"grammar">>): IDqmPluginGrammar[] {
    const activePluginsArr: IDqmPluginGrammar[] = [];
    for (let grammarName of set) {
      activePluginsArr.push(this.getSingle(grammarName));
    }
    return activePluginsArr;
  }

  private sortPlugins(activePluginsArr: IDqmPluginGrammar[]) {
    expandDependencies(activePluginsArr);
    return topologicalSort(activePluginsArr);
  }

  private dependencyGraph(
    activePluginsArr: IDqmPluginGrammar[],
  ): Record<PluginUrn<"grammar">, PluginUrn<"grammar">[]> {
    const dependencyGraph = activePluginsArr.reduce(
      (a, v) => (
        (a[Serialize.grammarName(v)] = PluginFilter.grammars(v.dependencies)), a
      ),
      {} as Record<PluginUrn<"grammar">, PluginUrn<"grammar">[]>,
    );
    return dependencyGraph;
  }
}
