import * as fs from "node:fs";
import * as ohm from "ohm-js";
import * as path from "path";
import type { NodeArgs, ParseContext, ParseNode } from "./types/types.mjs";
import { baseActions } from "./actions/base.action.mjs";
import { richTextActions } from "./actions/rich-text.action.mjs";
import { paramsV2Actions } from "./actions/params-v2.action.mjs";
import { frameV2Actions } from "./actions/frame-v2.action.mjs";
import type {
  GrammarSpecs,
  ParserPlugin,
  ParserPluginGrammar,
} from "./types/parser.mjs";

const OHM_PATH = "./assets/ohm";

function getLevel(specs: GrammarSpecs, filename: string): ParserPluginGrammar {
  const raw = fs
    .readFileSync(path.join(specs.versionPath, `${filename}.ohm`))
    .toString();

  const altered = raw.replace(/<:\s*(\w+)\s*\{/, (match, word) => {
    return `<: ${specs.parentGrammar} {`; // replace `word` however you want
  });

  return {
    raw,
    altered,
    grammar: ohm.grammar(altered, specs.dependencies),
  };
}

function getVersionData(basePath: fs.PathLike) {
  const paths = fs.readdirSync(basePath);
  const latestVersion = paths.sort().at(-1);
  return {
    semver: latestVersion,
    versionPath: path.join(basePath.toString(), latestVersion),
  };
}

function compileOperations(
  initSemantics: ohm.Semantics,
  sorted: string[],
  parsers: Record<string, Record<string, ohm.ActionDict<any>>>,
) {
  let semantics = initSemantics;
  const sortedSet = new Set(sorted);
  const operations = {};
  const participants = {};

  Object.entries(parsers).forEach(([parserName, parser]) => {
    if (!sortedSet.has(parserName)) {
      return;
    }
    Object.entries(parser).forEach(([operationName, actionDict]) => {
      if (!operations.hasOwnProperty(operationName)) {
        operations[operationName] = {};
        participants[operationName] = [];
      }
      participants[operationName].push(parserName);
      operations[operationName] = {
        ...operations[operationName],
        ...actionDict,
      };
    });
  });

  const methods = Object.entries(operations).reduce((a, [k, v]) => {
    a[k] = Object.keys(v);
    return a;
  }, {});

  Object.entries(operations).forEach(([operationName, actionDict]) => {
    semantics = semantics.addOperation(
      `${operationName}(context)`,
      actionDict as ohm.ActionDict<unknown>,
    );
  });

  return {
    participants,
    semantics,
    operations,
    methods,
  };
}
const configParserPlugin: ParserPlugin = {
  name: "RankiConfig",
  dependencies: [],
  parser: (specs) => getLevel(specs, "1-config"),
};

const baseParserPlugin: ParserPlugin = {
  name: "RankiBase",
  dependencies: ["RankiConfig"],
  parser: (specs) => getLevel(specs, "2-base"),
};

const paramsV2ParserPlugin: ParserPlugin = {
  name: "RankiParamsV2",
  dependencies: ["RankiBase", "RankiConfig"],
  parser: (specs) => getLevel(specs, "3-params-v2"),
};

const frameV2ParserPlugin: ParserPlugin = {
  name: "RankiFrameV2",
  dependencies: ["RankiParamsV2", "RankiBase", "RankiConfig"],
  parser: (specs) => getLevel(specs, "4-frame-v2"),
};

const richTextParserPlugin: ParserPlugin = {
  name: "RankiRichText",
  dependencies: ["RankiBase", "RankiConfig"],
  parser: (specs) => getLevel(specs, "3-rich-text"),
};

function topologicalSort(plugins: ParserPlugin[]): ParserPlugin["name"][] {
  const sorted = [];
  const adjacencies = plugins.reduce((a, c) => {
    a[c.name] = [];
    return a;
  }, {});

  plugins.forEach((p) => {
    p.dependencies.forEach((d) => {
      if (!adjacencies.hasOwnProperty(d)) {
        throw new Error(`DEPENDENCY ABSENT ${d}`);
      }
      adjacencies[d].push(p.name);
    });
  });

  const counts = Object.keys(adjacencies).reduce((a, c) => {
    a[c] = 0;
    return a;
  }, {});

  plugins
    .map((p) => p.name)
    .forEach((n) => {
      for (let a of adjacencies[n]) {
        counts[a]++;
      }
    });

  const queue = Object.entries(counts)
    .filter(([_k, v]) => !v)
    .map(([k, _v]) => k);

  while (queue.length) {
    const curr = queue.shift();
    sorted.push(curr);

    for (let n of adjacencies[curr]) {
      if (--counts[n] === 0) {
        queue.push(n);
      }
    }
  }

  if (sorted.length !== plugins.length) {
    console.log(sorted, plugins);
    throw new Error("CIRCULAR PLUGIN DEPENDENCY");
  }

  return sorted;
}

export function parse(raw: string) {
  const requestedPluginNames = [
    "RankiConfig",
    "RankiBase",
    "RankiParamsV2",
    "RankiFrameV2",
  ];
  const { versionPath, semver } = getVersionData(OHM_PATH);
  const plugins = {
    richTextParserPlugin,
    frameV2ParserPlugin,
    paramsV2ParserPlugin,
    baseParserPlugin,
    configParserPlugin,
  };
  const requestedPluginNamesSet = new Set(requestedPluginNames);
  const enabledPlugins = Object.entries(plugins)
    .filter(([k, v]) => requestedPluginNamesSet.has(v.name))
    .reduce((a, [k, v]) => {
      a[k] = v;
      return a;
    }, {} as typeof plugins);

  if (!Object.keys(enabledPlugins).length) {
    throw new Error("NO ENABLED PLUGINS");
  }

  const sorted = topologicalSort(Object.values(enabledPlugins));

  const matchers = {};
  let dependencies = {};
  for (let si = 0; si < sorted.length; si++) {
    const name = sorted[si];
    const plugin = Object.values(enabledPlugins).filter(
      (p) => p.name === name,
    )[0];
    if (!plugin) {
      throw new Error(`CANNOT FIND PLUGIN ${name}`);
    }
    const matcher = plugin.parser({
      versionPath,
      parentGrammar: si === 0 ? "" : sorted[si - 1],
      dependencies,
    });
    matchers[name] = matcher;
    dependencies = {
      ...dependencies,
      [name]: matcher.grammar,
    };
  }

  const last = sorted.at(-1);
  const matcher = matchers[last].grammar;

  if (!matcher) {
    throw new Error("CANNOT DEDUCE MATCHER");
  }

  const { semantics, participants, methods } = compileOperations(
    matcher.createSemantics(),
    requestedPluginNames,
    {
      RankiBase: baseActions,
      RankiRichText: richTextActions,
      RankiParamsV2: paramsV2Actions,
      RankiFrameV2: frameV2Actions,
    },
  );

  const matched = matcher.match(raw, "root");
  const context: ParseContext = {
    tokens: {
      sentence: {
        period: ".",
        question: "?",
        exclamation: "!",
      },
      paramsV2: {
        separator: {
          left: ",",
          right: ";",
        },
        key: {
          negation: "!",
        },
        operators: {
          assign: "=",
          append: "+=",
          remove: "-=",
        },
      },
    },
  };

  return {
    language: {
      version: semver,
      context,
    },
    stages: {
      raw,
      parser: {
        sorted,
        participants,
        methods,
        root: semantics(matched).node(context),
      },
    },
  };
}
