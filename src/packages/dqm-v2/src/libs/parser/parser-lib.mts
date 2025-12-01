import type {
  CreateParserReturn,
  IDqmPluginGrammar,
  ActionsDictRecord,
  DqmAstReport,
  ParseAstFunction,
  IAstNode,
  DqmPluginsConfigDefaults,
  DqmConfig,
  IAstNodeContext,
} from "@dqm/package-dqm-api-v2";
import { DqmError } from "@dqm/package-utils";
import type { ILibParser, T, Criteria } from "./parser-lib.types.mjs";
import { ParserHash, type ParserHashString } from "./hash.mjs";
import { expandDependencies, topologicalSort } from "./utils.mjs";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

type GrammarName = string & { type?: "GrammarName" };
export type GrammarActionsDict = Record<GrammarName, ActionsDictRecord>;

export class ParserLib implements ILibParser {
  private grammars = new Map<GrammarName, T>();
  private parsers = new Map<ParserHashString, CreateParserReturn>();
  private reports: Record<ParserHashString, DqmAstReport> = {};

  getGrammarDefaultConfigs(defaultConfig: DqmConfig): DqmPluginsConfigDefaults {
    const config = this.grammars.entries().reduce(
      (a, [k, v]) => (
        // @ts-expect-error
        (a[k] = v.config(defaultConfig)), a
      ),
      {},
    );
    const tokens = this.grammars
      .values()
      .reduce((a, c) => ((a[c.meta.name] = c.tokenizer()), a), {} as any);
    return { tokens, config };
  }

  add(plugin: IDqmPluginGrammar): ILibParser {
    if (this.grammars.has(plugin.meta.name)) {
      throw new DqmError("PLUGIN_GRAMMAR_REGISTERED", {
        list: this.grammars,
        plugin,
      });
    }
    this.grammars.set(plugin.meta.name, plugin);
    return this;
  }

  get(criteria: Criteria): CreateParserReturn {
    const hash = ParserHash.compute(criteria.name, criteria.config);
    const cached = this.parsers.get(hash);
    if (cached) {
      return cached;
    }
    const built = this.createNew(hash, criteria);
    const parser: CreateParserReturn = { parse: built };
    this.parsers.set(hash, parser);
    return parser;
  }

  private createNew(
    hash: ParserHashString,
    {
      // TODO name is likely not relevant
      // @ts-expect-error
      name,
      config,
    }: Criteria,
  ): ParseAstFunction {
    {
      const missingStandard = this.checkMissing(
        new Set(config.plugins.standards),
      );
      if (missingStandard.length) {
        throw new DqmError("MISSING_STANDARD_PARSERS", { missingStandard });
      }
    }
    {
      const missingRequested = this.checkMissing(
        new Set(config.plugins.requested),
      );
      if (missingRequested.length) {
        throw new DqmError("MISSING_REQUESTED_PARSERS", { missingRequested });
      }
    }

    const activePluginNames = new Set([
      ...config.plugins.standards,
      ...config.plugins.requested,
    ]);
    const activePluginsArr = this.pickPlugins(activePluginNames);
    const importChain = this.sortPlugins(activePluginsArr);
    const dependencyGraph = this.dependencyGraph(activePluginsArr);
    const { matcher, sources } = buildGrammar(
      config,
      importChain,
      (n) => this.grammars.get(n)!,
    );

    const actions = this.getActions();
    const { semantics, participants, methods } = compileOhmActionDicts(
      matcher,
      activePluginNames,
      actions,
    );

    const report: DqmAstReport = {
      cache: {
        hash,
        usageCount: 0,
      },
      graph: {
        requested: config.plugins.requested,
        sorted: importChain,
        dependencies: dependencyGraph,
        contributors: participants,
        methods,
      },
      grammar: {
        source: sources.join("\n"),
      },
      config,
    };
    if (this.reports[hash]) {
      throw new DqmError("PARSER_HASH_COLLISION", {
        hash,
        reports: this.reports,
      });
    }
    this.reports[hash] = report;

    const parseAst: ParseAstFunction = (
      raw: string,
      startRule: string,
      context: IAstNodeContext,
      // context: RankiLangContextInstance,
    ) => {
      const matched = matcher.match(raw, startRule);
      // const mergedContext = context.newChild();

      const root: IAstNode = semantics(matched).node(context);
      this.reports[hash].cache.usageCount++;
      return { props: {}, root };
    };

    return parseAst;
  }

  private namesSet(): Set<GrammarName> {
    return new Set<GrammarName>(this.grammars.keys());
  }

  private checkMissing(set: Set<string>): string[] {
    const importedPluginNameSet = this.namesSet();
    const missing = [];
    for (const name of set) {
      if (!importedPluginNameSet.has(name)) {
        missing.push(name);
      }
    }
    return missing;
  }

  private pickPlugins(set: Set<string>): T[] {
    // const activePluginsArr = this.getList().filter((v) => set.has(v.meta.name));
    const activePluginsArr: T[] = [];
    for (let name of set) {
      activePluginsArr.push(this.grammars.get(name)!);
    }
    return activePluginsArr;
  }

  private sortPlugins(activePluginsArr: T[]) {
    expandDependencies(activePluginsArr);
    const importChain = topologicalSort(activePluginsArr);
    return importChain;
  }

  private dependencyGraph(
    activePluginsArr: IDqmPluginGrammar[],
  ): Record<GrammarName, GrammarName[]> {
    const dependencyGraph = activePluginsArr.reduce(
      (a, v) => ((a[v.meta.name] = v.dependencies), a),
      {} as Record<string, string[]>,
    );
    return dependencyGraph;
  }

  //!FIX I don't like this. it's getting all actions for all grammars. it could choose to get the ones that it needs
  private getActions(): GrammarActionsDict {
    return this.grammars.values().reduce(
      // @ts-expect-error
      (a, c) => ((a[c.meta.name] = c.actions()), a),
      {},
    );
  }
}
