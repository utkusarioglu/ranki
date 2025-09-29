import type { ParserPlugins } from "./plugins.mjs";
import type {
  RankiLangParseContext,
  RankiLangParseResult,
} from "@ranki/package-api";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

export function parse(
  lang: RankiLangParseContext,
  raw: string,
): RankiLangParseResult {
  const parserPlugins: ParserPlugins = lang.getPlugins();

  const missingStandard = parserPlugins.checkMissing(
    new Set(lang.getConfig().merged.plugins.standards),
  );
  if (missingStandard.length) {
    throw new Error(`MISSING STANDARD PLUGINS: ${missingStandard.join(", ")}`);
  }

  const missingRequested = parserPlugins.checkMissing(
    new Set(lang.getConfig().merged.plugins.requested),
  );
  if (missingRequested.length) {
    throw new Error(
      `MISSING REQUESTED PLUGINS: ${missingRequested.join(", ")}`,
    );
  }

  const activePluginNames = new Set([
    ...lang.getConfig().merged.plugins.standards,
    ...lang.getConfig().merged.plugins.requested,
  ]);

  const activePluginsArr = parserPlugins.pickPlugins(activePluginNames);
  const importChain = parserPlugins.sortPlugins(activePluginsArr);
  const dependencyGraph = parserPlugins.dependencyGraph(activePluginsArr);

  const { matcher } = buildGrammar(lang, importChain, (n) =>
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
        requested: lang.getConfig().merged.plugins.requested,
        importChain,
        dependencyGraph,
      },
      config: lang.getConfig(),
    },
    stages: {
      raw,
      parse: {
        participants,
        methods,
        root: semantics(matched).node(lang),
      },
    },
  };
}
