// import type {
//   RankiLangParseDefinition,
//   // RankiLangAstContext,
//   RankiLangAstReport,
//   AstNode,
//   RankiLangConsolidatedAstReport,
//   // RankiLangContextInstance,
//   CreateParserReturn,
//   ParseAstFunction,
//   ParserPluginsInstance,
//   RankiLangContextInstance,
//   // RankiLangParseHandlerFunctionReturn,
// } from "@ranki/package-api-v2";
import { DqmError } from "@ranki/package-utils";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { ParserHash } from "./hash.mjs";
import type {
  CpsDefinition,
  DqmAstReport,
  DqmConfig,
  CreateParserReturn,
  ParseAstFunction,
  IAstNode,
  DqmConsolidatedAstReport,
  ICps,
  ICpx,
} from "@ranki/package-dqm-api-v2";
import type { ILibParser } from "./parser-lib.types.mjs";

export class RuleSet {
  // TODO why are these static?
  private static grammars: Record<string, CreateParserReturn> = {};
  private static reports: Record<string, DqmAstReport> = {};
  // hooks
  private parserLib!: ILibParser;
  private cps!: ICps;
  private cpx!: ICpx;

  // constructor(parserPlugins: ILibParser) {
  //   this.parserLib = parserPlugins;
  // }

  hookCpx(cpx: ICpx) {
    this.cpx = cpx;
    return this;
  }

  hookCps(cps: ICps) {
    this.cps = cps;
    return this;
  }

  hookParserLib(lib: ILibParser) {
    this.parserLib = lib;
    return this;
  }

  createParser(
    parseHandlerDef: CpsDefinition,
    config: DqmConfig,
  ): CreateParserReturn {
    const hash = ParserHash.compute(parseHandlerDef, config);
    if (!RuleSet.grammars[hash]) {
      const parser = this.createNewParser(hash, config);
      const expandedDefinition = {
        hash,
        ...parseHandlerDef,
      };
      RuleSet.grammars[hash] = {
        expandedDefinition,
        callback: parser,
      };
    }
    return RuleSet.grammars[hash];
  }

  private createNewParser(hash: string, config: DqmConfig): ParseAstFunction {
    // const langConfig = config.getAll();
    const configPlugins = config.plugins;

    {
      const missingStandard = this.parserLib.checkMissing(
        new Set(configPlugins.standards),
      );
      if (missingStandard.length) {
        throw new DqmError("MISSING_STANDARD_PARSERS", { missingStandard });
      }
    }

    {
      const missingRequested = this.parserLib.checkMissing(
        new Set(configPlugins.requested),
      );
      if (missingRequested.length) {
        throw new DqmError("MISSING_REQUESTED_PARSERS", { missingRequested });
      }
    }

    const activePluginNames = new Set([
      ...configPlugins.standards,
      ...configPlugins.requested,
    ]);

    const activePluginsArr = this.parserLib.pickPlugins(activePluginNames);
    const importChain = this.parserLib.sortPlugins(activePluginsArr);
    const dependencyGraph = this.parserLib.dependencyGraph(activePluginsArr);

    const { matcher, sources } = buildGrammar(config, importChain, (n) =>
      this.parserLib.find(n),
    );

    const actions = this.parserLib.getActions();

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
        requested: configPlugins.requested,
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
    if (RuleSet.reports[hash]) {
      throw new Error(`HASH COLLISION FOR ${hash}`);
    }
    RuleSet.reports[hash] = report;

    const parseAst: ParseAstFunction = (
      raw: string,
      // context: RankiLangContextInstance,
    ) => {
      const matched = matcher.match(raw, context.getStartRule());
      // const mergedContext = context.newChild();

      const root: IAstNode = semantics(matched).node(context);
      RuleSet.reports[hash].cache.usageCount++;
      return { props: {}, root };
    };

    return parseAst;
  }

  getReports(): DqmConsolidatedAstReport {
    const list = Object.values(RuleSet.reports);
    return {
      count: list.length,
      list,
    };
  }
}
