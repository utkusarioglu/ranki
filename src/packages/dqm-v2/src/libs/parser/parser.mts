import type {
  IDqmPluginGrammar,
  DqmAstReport,
  IAstNode,
  IAstNodeContext,
  IParser,
  RankiLangParseFunctionReturn,
  ParserHashString,
  DqmInternalConfig,
  // IParserConstructorHooks,
  GrammarName,
  ILibGrammar,
} from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { expandDependencies, topologicalSort } from "./utils.mjs";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { Serialize } from "../../serialize.mjs";
import type { Grammar, Semantics } from "ohm-js";
import { assertExists } from "@dqm/package-dqm-utils";

export class Parser implements IParser {
  private hash: ParserHashString;
  private config: DqmInternalConfig;
  private readonly grammarLib: ILibGrammar;
  private report: DqmAstReport | null = null;
  private matcher: Grammar | null = null;
  private semantics: Semantics | null = null;

  constructor(
    hash: ParserHashString,
    config: DqmInternalConfig,
    grammarLib: ILibGrammar,
  ) {
    this.hash = hash;
    this.config = config;
    this.grammarLib = grammarLib;
    this.create();
  }

  private create(): void {
    const standardsSet = new Set(
      this.config.plugins.standards.filter((v) => v.startsWith("grammar:")),
    );
    const requestedSet = new Set(
      this.config.plugins.requested.filter((v) => v.startsWith("grammar:")),
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

    this.report = {
      cache: {
        hash: this.hash,
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
      config: this.config,
    };
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
    assertExists(this.report, {
      why: "Report needs to be created in order to parse",
    });
    const matched = this.matcher.match(raw, startRule);
    // const mergedContext = context.newChild();

    const root: IAstNode = this.semantics(matched).node(context);
    this.report.cache.usageCount++;
    return { root };
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

  getReport(): DqmAstReport | null {
    return this.report;
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
