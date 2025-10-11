import type { ParserPlugins } from "../parser/parser-plugins.mjs";
import type {
  RankiLangAstContext,
  RankiLangParseFunctionReturn,
} from "@ranki/package-api-v2";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

export function ast(
  context: RankiLangAstContext,
  raw: string,
): RankiLangParseFunctionReturn {
  const parserPlugins: ParserPlugins = context.lang.getPlugins();
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

  const { matcher } = buildGrammar(context, importChain, (n) =>
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
      // language: {
      //   versions: parserPlugins.getVersions(),
      //   // context,
      // },
      parser: {
        requested: configPlugins.requested,
        sorted: importChain,
        graph: dependencyGraph,
        contributors: participants,
        methods,
      },
      // config: langConfig,
    },
    root: semantics(matched).node(context),
  };
}
