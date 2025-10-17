import type {
  ParserPluginsInstance,
  RankiLangAstContext,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api-v2";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

export function ast(
  raw: string,
  context: RankiLangAstContext,
): RankiLangParseFunctionReturn {
  const parserPlugins: ParserPluginsInstance = context.lang.getPlugins();
  const langConfig = context.lang.getConfig();
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

  const matched = matcher.match(raw, context.startRule);

  return {
    report: {
      parser: {
        requested: configPlugins.requested,
        sorted: importChain,
        graph: dependencyGraph,
        contributors: participants,
        methods,
        // @ts-expect-error
        source: sources.join("\n\n"),
      },
    },
    root: semantics(matched).node(context),
  };
}
