import type {
  DqmAstReport,
  IAstNode,
  IAstNodeContext,
  IParser,
  ILibParserParseReturn,
  ParserHashString,
  DqmInternalConfig,
  ILibGrammar,
  ILibGrammarGetReturn,
} from "@dqm/package-dqm-api-v2";
import { assertExists, assertSetEmpty } from "@dqm/package-dqm-utils";
import { ParserReport } from "./report.mjs";
import { PluginFilter } from "../../../utils/plugin.mjs";

export class Parser implements IParser {
  private readonly hash: ParserHashString;
  private readonly config: DqmInternalConfig;
  private readonly grammarLib: ILibGrammar;
  private readonly report: ParserReport;
  private grammar: ILibGrammarGetReturn | null = null;

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

    assertSetEmpty(this.grammarLib.listMissing(standards), {
      why: "A parser listed in the merged config object is is not installed",
      details: {
        configDemandedParsers: standards,
      },
    });

    assertSetEmpty(this.grammarLib.listMissing(requested), {
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
    this.grammar = this.grammarLib.get({
      grammarNames: all,
      config: this.config,
    });

    this.report
      .setStandards(standards)
      .setRequested(requested)
      .setBuiltGrammar(this.grammar);
  }

  parse(
    raw: string,
    startRule: string,
    context: IAstNodeContext,
  ): ILibParserParseReturn {
    assertExists(this.grammar, {
      why: "Semantics and matcher need to be created in order to parse",
    });
    const matched = this.grammar.matcher.match(raw, startRule);
    const root: IAstNode = this.grammar.semantics(matched).node(context);
    this.report.incrementUsageCount();
    return { root };
  }

  getReport(): DqmAstReport {
    return this.report.getReport();
  }
}
