import type { ParserPlugins } from "./plugins.mjs";
import type { ParseContext } from "@ranki/package-api";
import { buildGrammar, compileOhmActionDicts } from "./grammar.mjs";

// import { rankiConstantsV2ParserPlugin } from "@ranki/plugin-parser-constants-v2";
// import { rankiBaseV2ParserPlugin } from "@ranki/plugin-parser-base-v2";
// import { rankiParamsV2ParserPlugin } from "@ranki/plugin-parser-params-v2";
// import { rankiFrameV2ParserPlugin } from "@ranki/plugin-parser-frame-v2";
// import { rankiRichTextV2ParserPlugin } from "@ranki/plugin-parser-rich-text-v2";
// import { rankiRichNumberV2ParserPlugin } from "@ranki/plugin-parser-rich-number-v2";
// import { rankiRichStructureV2ParserPlugin } from "@ranki/plugin-parser-rich-structure-v2";
// import { rankiFrameV1ParserPlugin } from "@ranki/plugin-parser-frame-v1";

export function parse(context: ParseContext, raw: string) {
  const parserPlugins: ParserPlugins = context.methods.parserPlugins;

  const missingStandard = parserPlugins.checkMissing(
    new Set(context.config.merged.plugins.standards),
  );
  if (missingStandard.length) {
    throw new Error(`MISSING STANDARD PLUGINS: ${missingStandard.join(", ")}`);
  }

  const missingRequested = parserPlugins.checkMissing(
    new Set(context.config.merged.plugins.requested),
  );
  if (missingRequested.length) {
    throw new Error(
      `MISSING REQUESTED PLUGINS: ${missingRequested.join(", ")}`,
    );
  }

  const activePluginNames = new Set([
    ...context.config.merged.plugins.standards,
    ...context.config.merged.plugins.requested,
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
        requested: context.config.merged.plugins.requested,
        importChain,
        dependencyGraph,
      },
      config: context.config,
    },
    stages: {
      raw,
      parse: {
        participants,
        methods,
        root: semantics(matched).node(context),
      },
    },
  };
}
