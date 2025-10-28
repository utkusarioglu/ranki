import type {
  RankiLangParseHandler,
  RankiLangParsedAst,
  RankiLangAstContext,
  ParseAstFunction,
  RankiLangAstReport,
  AstNode,
  RankiLangConsolidatedAstReport,
  RankiLangContextInstance,
} from "@ranki/package-api-v2";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";
import { ParserHash } from "./hash.mjs";

export class AstLibrary {
  private static parsers: Record<string, ParseAstFunction> = {};
  private static reports: Record<string, RankiLangAstReport> = {};

  parse(
    theaterRaw: string,
    context: RankiLangContextInstance,
  ): RankiLangParsedAst {
    // const handler = context.getHandler(context["parser"].type);
    const type = context.getParserDefinition().type;
    const handler = context.getHandler(type);

    // context.parseAst = this.createParser(context);
    return handler(theaterRaw, context);
  }

  createParser(
    parseHandlerDef: RankiLangParseHandler,
    context: RankiLangAstContext,
  ) {
    // const hash = djb2Hash(stringifyContext(context)).toString();
    const hash = ParserHash.compute(parseHandlerDef, context);
    if (!AstLibrary.parsers[hash]) {
      const parser = this.createNewParser(hash, context);
      AstLibrary.parsers[hash] = parser;
    }
    return AstLibrary.parsers[hash];
  }

  private createNewParser(
    hash: string,
    context: RankiLangAstContext,
  ): ParseAstFunction {
    // const parserPlugins: ParserPluginsInstance = context.hooks.getPlugins();
    // const langConfig = context.hooks.getConfig();
    // const configPlugins = langConfig.merged.plugins;
    const parserPlugins = context.getPlugins();
    const langConfig = context.getAllConfig();
    const configPlugins = context.getMergedConfig().plugins;

    {
      const missingStandard = parserPlugins.checkMissing(
        new Set(configPlugins.standards),
      );
      if (missingStandard.length) {
        throw new Error(
          `MISSING STANDARD PLUGINS: ${missingStandard.join(", ")}`,
        );
      }
    }

    {
      const missingRequested = parserPlugins.checkMissing(
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

    const activePluginsArr = parserPlugins.pickPlugins(activePluginNames);
    const importChain = parserPlugins.sortPlugins(activePluginsArr);
    const dependencyGraph = parserPlugins.dependencyGraph(activePluginsArr);

    const { matcher, sources } = buildGrammar(context, importChain, (n) =>
      parserPlugins.find(n),
    );

    const actions = parserPlugins.getActions();

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
      providedContext: RankiLangAstContext,
    ) => {
      const matched = matcher.match(raw, context.getStartRule());
      const mergedContext = context.newChild();
      const parserDef = providedContext.getParserDefinition();
      mergedContext.setParser(parserDef);

      const root: AstNode = semantics(matched).node(mergedContext);
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
