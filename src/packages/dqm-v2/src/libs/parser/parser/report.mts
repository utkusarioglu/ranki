import type {
  DqmAstReport,
  DqmInternalConfig,
  DqmPluginName,
  ILibGrammarGetReturn,
  ParserHashString,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-dqm-utils";

type RequestedSet = Set<DqmPluginName>;

export class ParserReport {
  private readonly hash: ParserHashString;
  private readonly config: DqmInternalConfig;
  private grammar: ILibGrammarGetReturn | null = null;
  private requested: RequestedSet | null = null;
  private standards: RequestedSet | null = null;
  private usageCount = 0;

  constructor(hash: ParserHashString, config: DqmInternalConfig) {
    this.hash = hash;
    this.config = config;
  }

  setBuiltGrammar(g: ILibGrammarGetReturn) {
    this.grammar = g;
    return this;
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

  getReport(): DqmAstReport {
    assertExists(this.grammar, {
      why: "Grammar built properties need to be set using setBuiltGrammar",
    });
    assertExists(this.requested, {
      why: "RequestedSet has to be set by the parser",
    });
    assertExists(this.standards, {
      why: "Standards set has to be set by the parser",
    });

    return {
      cache: {
        hash: this.hash,
        usageCount: this.usageCount,
      },
      grammar: {
        standards: Array.from(this.standards),
        requested: Array.from(this.requested),
        sorted: this.grammar.sorted,
        contributors: this.grammar.contributors,
        methods: this.grammar.methods,
        graphs: this.grammar.graphs,
        sources: this.grammar.sources,
      },
      config: this.config,
    };
  }
}
