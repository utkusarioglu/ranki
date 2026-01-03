import type {
  DqmAstReport,
  IAstNode,
  IAstNodeContext,
  IParser,
  RankiLangParseFunctionReturn,
  ParserHashString,
  DqmInternalConfig,
  ILibGrammar,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";
import type { Grammar, Semantics } from "ohm-js";
import { assertArrayEmpty, assertExists } from "@dqm/package-dqm-utils";
import { ParserReport } from "./report.mjs";
import { PluginFilter } from "../../../utils/plugin.mjs";

export class Parser implements IParser {
  private readonly hash: ParserHashString;
  private readonly config: DqmInternalConfig;
  private readonly grammarLib: ILibGrammar;
  private readonly report: ParserReport;
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
    this.report = new ParserReport(this.hash, this.config);
    this.create();
  }

  private getGrammarLists() {
    const plugins = this.config.plugins;
    const standards = new Set(PluginFilter.grammars(plugins.standards));
    const requested = new Set(PluginFilter.grammars(plugins.requested));

    assertArrayEmpty(this.checkMissing(standards), {
      why: "A parser listed in the merged config object is is not installed",
      details: {
        configDemandedParsers: standards,
      },
    });

    assertArrayEmpty(this.checkMissing(requested), {
      why: "Components cannot function without their requested parsers",
      details: {
        configRequestedParsers: requested,
      },
    });

    const all = new Set([...standards, ...requested]);

    return { all, standards, requested };
  }

  private create(): void {
    const { all, standards, requested } = this.getGrammarLists();
    const grammar = this.grammarLib.get({
      grammarNames: all,
      config: this.config,
    });
    this.matcher = grammar.matcher;
    this.semantics = grammar.semantics;

    this.report
      .setStandards(standards)
      .setRequested(requested)
      .setImportChain(grammar.sorted)
      .setDependencyGraph(grammar.graph)
      .setContributors(grammar.contributors)
      .setMethods(grammar.methods)
      .setSources(grammar.sources);
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

  private checkMissing(set: Set<PluginUrn<"grammar">>): string[] {
    const importedPluginNameSet = this.grammarLib.getNames();
    const missing = [];
    for (const name of set) {
      if (!importedPluginNameSet.has(name)) {
        missing.push(name);
      }
    }
    return missing;
  }
}
