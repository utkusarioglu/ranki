import type {
  ParserPluginsInstance,
  RankiLangAstContext,
  RankiLangAstReport,
  RankiLangParseFunctionReturn,
  ParseAstFunction,
  AstNode,
} from "@ranki/package-api-v2";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

export function createParser(context: RankiLangAstContext): ParseAstFunction {
  const parserPlugins: ParserPluginsInstance = context.hooks.getPlugins();
  const langConfig = context.hooks.getConfig();
  const configPlugins = langConfig.merged.plugins;

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
    parser: {
      requested: configPlugins.requested,
      sorted: importChain,
      graph: dependencyGraph,
      contributors: participants,
      methods,
      // @ts-ignore
      source: sources.join("\n\n"),
    },
  };

  console.log({ report });

  const parseAst: ParseAstFunction = (raw: string) => {
    const matched = matcher.match(raw, context.startRule);
    const root: AstNode = semantics(matched).node(context);
    return { root };
  };

  return parseAst;
}

// export function ast(
//   raw: string,
//   context: RankiLangAstContext,
// ): RankiLangParseFunctionReturn {
//   const parseAst = createParser(context);
//   return {
//     root: parseAst(raw),
//   };
// }
