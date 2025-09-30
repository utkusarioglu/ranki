import type { ParserPlugins } from "./plugins.mjs";
import type {
  RankiLangParseContext,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

export function parse(
  context: RankiLangParseContext,
  raw: string,
): RankiLangParseFunctionReturn {
  const parserPlugins: ParserPlugins = context.lang.getPlugins();

  const missingStandard = parserPlugins.checkMissing(
    new Set(context.lang.getConfig().merged.plugins.standards),
  );
  if (missingStandard.length) {
    throw new Error(`MISSING STANDARD PLUGINS: ${missingStandard.join(", ")}`);
  }

  const missingRequested = parserPlugins.checkMissing(
    new Set(context.lang.getConfig().merged.plugins.requested),
  );
  if (missingRequested.length) {
    throw new Error(
      `MISSING REQUESTED PLUGINS: ${missingRequested.join(", ")}`,
    );
  }

  const activePluginNames = new Set([
    ...context.lang.getConfig().merged.plugins.standards,
    ...context.lang.getConfig().merged.plugins.requested,
  ]);

  const activePluginsArr = parserPlugins.pickPlugins(activePluginNames);
  const importChain = parserPlugins.sortPlugins(activePluginsArr);
  const dependencyGraph = parserPlugins.dependencyGraph(activePluginsArr);

  const { matcher } = buildGrammar(context, importChain, (n) =>
    parserPlugins.find(n),
  );

  const actions = parserPlugins.getActions();

  const { semantics, participants, methods } = compileOhmActionDicts(
    matcher,
    activePluginNames,
    actions,
  );

  const matched = matcher.match(raw, "root");

  return {
    report: {
      language: {
        versions: parserPlugins.getVersions(),
        // context,
      },
      parser: {
        requested: context.lang.getConfig().merged.plugins.requested,
        sorted: importChain,
        graph: dependencyGraph,
        contributors: participants,
        methods,
      },
      config: context.lang.getConfig(),
    },
    parsed: semantics(matched).node(context),
  };
}
