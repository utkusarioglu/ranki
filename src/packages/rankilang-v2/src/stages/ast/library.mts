import type {
  RankiLangParseDefinition,
  // RankiLangAstContext,
  RankiLangAstReport,
  AstNode,
  RankiLangConsolidatedAstReport,
  // RankiLangContextInstance,
  CreateParserReturn,
  ParseAstFunction,
  ParserPluginsInstance,
  RankiLangContextInstance,
  // RankiLangParseHandlerFunctionReturn,
} from "@ranki/package-api-v2";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { ParserHash } from "./hash.mjs";
import type { RankiLangConfig } from "../../config.mjs";

export class AstLibrary {
  // TODO why are these static?
  private static parsers: Record<string, CreateParserReturn> = {};
  private static reports: Record<string, RankiLangAstReport> = {};
  // hooks
  private parserPlugins: ParserPluginsInstance;

  constructor(parserPlugins: ParserPluginsInstance) {
    this.parserPlugins = parserPlugins;
  }

  createParser(
    parseHandlerDef: RankiLangParseDefinition,
    // context: RankiLangAstContext,
    config: RankiLangConfig,
    // parserPlugins: ParserPluginsInstance,
  ): CreateParserReturn {
    const hash = ParserHash.compute(parseHandlerDef, config);
    if (!AstLibrary.parsers[hash]) {
      const parser = this.createNewParser(hash, config);
      const expandedDefinition = {
        hash,
        ...parseHandlerDef,
      };
      AstLibrary.parsers[hash] = {
        expandedDefinition,
        callback: parser,
      };
    }
    return AstLibrary.parsers[hash];
  }

  private createNewParser(
    hash: string,
    // context: RankiLangAstContext,
    config: RankiLangConfig,
    // parserPlugins: ParserPluginsInstance,
  ): ParseAstFunction {
    // const parserPlugins = context.getPlugins();
    // const langConfig = context.getAllConfig();
    // const configPlugins = context.getMergedConfig().plugins;
    // const parserPlugins = config.getAll()
    const langConfig = config.getAll();
    const configPlugins = config.getMerged().plugins;

    {
      const missingStandard = this.parserPlugins.checkMissing(
        new Set(configPlugins.standards),
      );
      if (missingStandard.length) {
        throw new Error(
          `MISSING STANDARD PLUGINS: ${missingStandard.join(", ")}`,
        );
      }
    }

    {
      const missingRequested = this.parserPlugins.checkMissing(
        new Set(configPlugins.requested),
      );
      if (missingRequested.length) {
        throw new Error(
          `MISSING REQUESTED PLUGINS: ${missingRequested.join(", ")}`,
        );
      }
    }

    const activePluginNames = new Set([
      ...configPlugins.standards,
      ...configPlugins.requested,
    ]);

    const activePluginsArr = this.parserPlugins.pickPlugins(activePluginNames);
    const importChain = this.parserPlugins.sortPlugins(activePluginsArr);
    const dependencyGraph =
      this.parserPlugins.dependencyGraph(activePluginsArr);

    const { matcher, sources } = buildGrammar(config, importChain, (n) =>
      this.parserPlugins.find(n),
    );

    const actions = this.parserPlugins.getActions();

    const { semantics, participants, methods } = compileOhmActionDicts(
      matcher,
      activePluginNames,
      actions,
    );

    const report: RankiLangAstReport = {
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
      config: langConfig,
    };
    if (AstLibrary.reports[hash]) {
      throw new Error(`HASH COLLISION FOR ${hash}`);
    }
    AstLibrary.reports[hash] = report;

    const parseAst: ParseAstFunction = (
      raw: string,
      context: RankiLangContextInstance,
    ) => {
      const matched = matcher.match(raw, context.getStartRule());
      // const mergedContext = context.newChild();

      const root: AstNode = semantics(matched).node(context);
      AstLibrary.reports[hash].cache.usageCount++;
      return { root };
    };

    return parseAst;
  }

  getReports(): RankiLangConsolidatedAstReport {
    const list = Object.values(AstLibrary.reports);
    return {
      count: list.length,
      list,
    };
  }
}
