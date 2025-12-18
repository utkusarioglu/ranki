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
  DqmPluginName,
} from "@dqm/package-dqm-api-v2";
import type { ILibParser, T, Criteria } from "./parser-lib.types.mjs";
import { ParserHash, type ParserHashString } from "./hash.mjs";
import { expandDependencies, topologicalSort } from "./utils.mjs";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

type GrammarName = DqmPluginName & { subtype?: "GrammarName" };

export type GrammarActionsDict = Record<GrammarName, ActionsDictRecord>;

export class ParserLib implements ILibParser {
  private grammars = new Map<GrammarName, T>();
  private parsers = new Map<ParserHashString, CreateParserReturn>();
  private reports: Record<ParserHashString, DqmAstReport> = {};

  private buildKey(type: string, name: string) {
    return [type, name].join(":");
  }

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
      .reduce(
        (a, c) => ((a[this.buildKey(c.type, c.meta.name)] = c.tokenizer()), a),
        {} as any,
      );
    return { tokens, config };
  }

  add(plugin: IDqmPluginGrammar): ILibParser {
    const key = this.buildKey(plugin.type, plugin.meta.name);
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
    // const standards = config.plugins.standards.filter((v) =>
    //   v.startsWith("grammar:"),
    // );
    const standardsSet = new Set(
      config.plugins.standards.filter((v) => v.startsWith("grammar:")),
    );
    // const requested = config.plugins.requested.filter((v) =>
    //   v.startsWith("grammar:"),
    // );
    const requestedSet = new Set(
      config.plugins.requested.filter((v) => v.startsWith("grammar:")),
    );

    {
      const missingStandard = this.checkMissing(standardsSet);
      if (missingStandard.length) {
        throw new DqmAppError({
          code: "MISSING_STANDARD_PARSERS",
          why: "A parser listed in the merged config object is is not installed",
          cause: null,
          details: {
            missingStandard,
            configDemandedParsers: standardsSet,
          },
        });
      }
    }
    {
      const missingRequested = this.checkMissing(requestedSet);
      if (missingRequested.length) {
        throw new DqmAppError({
          code: "MISSING_REQUESTED_PARSERS",
          why: "Components cannot function without their requested parsers",
          details: {
            missingRequested,
            configRequestedParsers: requestedSet,
          },
          cause: null,
        });
      }
    }

    // const activePluginNames = new Set([...standards, ...requested]);
    const activePluginNames = new Set([...standardsSet, ...requestedSet]);
    const activePluginsArr = this.pickPlugins(activePluginNames);
    const importChain = this.sortPlugins(activePluginsArr);
    const dependencyGraph = this.dependencyGraph(activePluginsArr);
    const { matcher, sources } = buildGrammar(config, importChain, (n) => {
      return this.grammars.get(n)!;
    });

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
        requested: Array.from(requestedSet),
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
      throw new DqmAppError({
        code: "PARSER_HASH_COLLISION",
        why: "Current configuration returns the same hash with a previous unrelated configuration",
        cause: null,
        details: {
          hash,
          reports: this.reports,
        },
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
      (a, v) => ((a[this.buildKey(v.type, v.meta.name)] = v.dependencies), a),
      {} as Record<string, string[]>,
    );
    return dependencyGraph;
  }

  private getActions(): GrammarActionsDict {
    return this.grammars
      .values()
      .reduce(
        (a, c) => ((a[this.buildKey(c.type, c.meta.name)] = c.actions()), a),
        {} as GrammarActionsDict,
      );
  }
}
