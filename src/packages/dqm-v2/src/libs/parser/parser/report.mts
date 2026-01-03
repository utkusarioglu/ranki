import type {
  Contributors,
  DependencyGraph,
  DqmAstReport,
  DqmInternalConfig,
  DqmParserGraphMethods,
  DqmPluginName,
  OhmGrammarSource,
  ParserHashString,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

type RequestedSet = Set<DqmPluginName>;

export class ParserReport {
  private readonly hash: ParserHashString;
  private readonly config: DqmInternalConfig;
  private requested: RequestedSet | null = null;
  private standards: RequestedSet | null = null;
  private importChain: DqmPluginName[] | null = null;
  private dependencyGraph: DependencyGraph | null = null;
  private contributors: Contributors | null = null;
  private methods: DqmParserGraphMethods | null = null;
  private sources: OhmGrammarSource[] | null = null;
  private usageCount = 0;

  constructor(hash: ParserHashString, config: DqmInternalConfig) {
    this.hash = hash;
    this.config = config;
  }

  incrementUsageCount() {
    this.usageCount++;
  }

  setStandards(s: RequestedSet): this {
    this.standards = s;
    return this;
  }

  setRequested(requested: RequestedSet): this {
    this.requested = requested;
    return this;
  }

  setImportChain(chain: DqmPluginName[]): this {
    this.importChain = chain;
    return this;
  }

  setDependencyGraph(dg: DependencyGraph): this {
    this.dependencyGraph = dg;
    return this;
  }

  setContributors(c: Contributors): this {
    this.contributors = c;
    return this;
  }

  setMethods(m: DqmParserGraphMethods): this {
    this.methods = m;
    return this;
  }

  setSources(s: OhmGrammarSource[]): this {
    this.sources = s;
    return this;
  }

  getReport(): DqmAstReport {
    assertExists(this.standards, {
      why: "Standards has to be set by the parser",
    });
    assertExists(this.requested, {
      why: "RequestedSet has to be set by the parser",
    });
    assertExists(this.importChain, {
      why: "Import Chain has to be set by the parser",
    });
    assertExists(this.dependencyGraph, {
      why: "Dependency Graph has to be set by the parser",
    });
    assertExists(this.contributors, {
      why: "Contributors has to be set by the parser",
    });
    assertExists(this.methods, {
      why: "Contributors has to be set by the parser",
    });
    assertExists(this.sources, {
      why: "Sources has to be set by the parser",
    });
    return {
      cache: {
        hash: this.hash,
        usageCount: this.usageCount,
      },
      graph: {
        standards: Array.from(this.standards),
        requested: Array.from(this.requested),
        sorted: this.importChain,
        dependencies: this.dependencyGraph,
        contributors: this.contributors,
        methods: this.methods,
      },
      grammar: {
        source: this.sources.join("\n"),
      },
      config: this.config,
    };
  }
}
