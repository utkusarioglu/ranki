import type {
  IDqmPluginGrammar,
  DqmAstReport,
  IAstNode,
  IAstNodeContext,
  IParser,
  RankiLangParseFunctionReturn,
  ParserHashString,
  DqmInternalConfig,
  GrammarName,
  ILibGrammar,
  DqmPluginName,
} from "@dqm/package-dqm-api-v2";
import { expandDependencies, topologicalSort } from "./utils.mjs";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { Serialize } from "../../../serialize.mjs";
import type { Grammar, Semantics } from "ohm-js";
import { assertArrayEmpty, assertExists } from "@dqm/package-dqm-utils";
import { ParserReport } from "./report.mjs";

export class Parser implements IParser {
  private readonly hash: ParserHashString;
  private readonly config: DqmInternalConfig;
  private readonly grammarLib: ILibGrammar;
  private matcher: Grammar | null = null;
  private semantics: Semantics | null = null;
  private readonly report: ParserReport;

  constructor(
    hash: ParserHashString,
    config: DqmInternalConfig,
    grammarLib: ILibGrammar,
  ) {
    this.hash = hash;
    this.config = config;
    this.grammarLib = grammarLib;
    this.report = new ParserReport(this.hash, this.config);
    this.create();
  }

  private filterGrammars(p: DqmPluginName[]): Set<DqmPluginName> {
    return new Set(p.filter((v) => v.startsWith("grammar:")));
  }

  private create(): void {
    const standardsSet = this.filterGrammars(this.config.plugins.standards);
    const requestedSet = this.filterGrammars(this.config.plugins.requested);

    assertArrayEmpty(this.checkMissing(standardsSet), {
      why: "A parser listed in the merged config object is is not installed",
      details: {
        configDemandedParsers: standardsSet,
      },
    });

    assertArrayEmpty(this.checkMissing(requestedSet), {
      why: "Components cannot function without their requested parsers",
      details: {
        configRequestedParsers: requestedSet,
      },
    });

    const activePluginNames = new Set([...standardsSet, ...requestedSet]);
    const activePluginsArr = this.pickPlugins(activePluginNames);
    const importChain = this.sortPlugins(activePluginsArr);
    const dependencyGraph = this.dependencyGraph(activePluginsArr);
    const { matcher, sources } = buildGrammar(
      this.config,
      importChain,
      (grammarName) => {
        return this.grammarLib.get({ grammarName });
      },
    );

    const actions = this.grammarLib.getActions();
    const { semantics, participants, methods } = compileOhmActionDicts(
      matcher,
      activePluginNames,
      actions,
    );
    this.matcher = matcher;
    this.semantics = semantics;

    this.report
      .setRequested(requestedSet)
      .setImportChain(importChain)
      .setDependencyGraph(dependencyGraph)
      .setContributors(participants)
      .setMethods(methods)
      .setSources(sources);
  }

  parse(
    raw: string,
    startRule: string,
    context: IAstNodeContext,
  ): RankiLangParseFunctionReturn {
    assertExists(this.matcher, {
      why: "Matcher needs to be created in order to parse",
    });
    assertExists(this.semantics, {
      why: "Semantics needs to be created in order to parse",
    });
    const matched = this.matcher.match(raw, startRule);

    const root: IAstNode = this.semantics(matched).node(context);
    this.report.incrementUsageCount();
    return { root };
  }

  getReport(): DqmAstReport {
    return this.report.getReport();
  }

  private checkMissing(set: Set<string>): string[] {
    const importedPluginNameSet = this.grammarLib.getNames();
    const missing = [];
    for (const name of set) {
      if (!importedPluginNameSet.has(name)) {
        missing.push(name);
      }
    }
    return missing;
  }

  private pickPlugins(set: Set<string>): IDqmPluginGrammar[] {
    const activePluginsArr: IDqmPluginGrammar[] = [];
    for (let grammarName of set) {
      activePluginsArr.push(this.grammarLib.get({ grammarName }));
    }
    return activePluginsArr;
  }

  private sortPlugins(activePluginsArr: IDqmPluginGrammar[]) {
    expandDependencies(activePluginsArr);
    const importChain = topologicalSort(activePluginsArr);
    return importChain;
  }

  private dependencyGraph(
    activePluginsArr: IDqmPluginGrammar[],
  ): Record<GrammarName, GrammarName[]> {
    const dependencyGraph = activePluginsArr.reduce(
      (a, v) => (
        (a[Serialize.grammarName(v.type, v.meta.name)] = v.dependencies), a
      ),
      {} as Record<string, string[]>,
    );
    return dependencyGraph;
  }
}
