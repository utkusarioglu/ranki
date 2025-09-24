import * as fs from "node:fs";
import * as ohm from "ohm-js";
import * as path from "path";
import type { NodeArgs, ParseContext, ParseNode } from "./types/types.mjs";
import { baseActions } from "./actions/base.action.mjs";
import { richTextActions } from "./actions/rich-text.action.mjs";
import { paramsV2Actions } from "./actions/params-v2.action.mjs";
import { frameV2Actions } from "./actions/frame-v2.action.mjs";
import { richNumberActions } from "./actions/rich-number.mjs";
import { richStructureActions } from "./actions/rich-structure.action.mjs";
import { frameV1Actions } from "./actions/frame-v1.action.mjs";
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
    if (specs.parentGrammar === "") {
      throw new Error("GRAMMAR EXPECTS A PARENT BUT NONE WAS GIVEN");
    }
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
  dependencies: ["RankiBase"],
  parser: (specs) => getLevel(specs, "3-params-v2"),
};

const frameV2ParserPlugin: ParserPlugin = {
  name: "RankiFrameV2",
  dependencies: ["RankiParamsV2"],
  parser: (specs) => getLevel(specs, "4-frame-v2"),
};

const richTextParserPlugin: ParserPlugin = {
  name: "RankiRichText",
  dependencies: ["RankiBase"],
  parser: (specs) => getLevel(specs, "3-rich-text"),
};

const richNumberParserPlugin: ParserPlugin = {
  name: "RankiRichNumber",
  dependencies: ["RankiBase"],
  parser: (specs) => getLevel(specs, "3-rich-number"),
};

const richStructureParserPlugin: ParserPlugin = {
  name: "RankiRichStructure",
  dependencies: ["RankiParamsV2"],
  parser: (specs) => getLevel(specs, "4-rich-structure"),
};

const frameV1ParserPlugin: ParserPlugin = {
  name: "RankiFrameV1",
  dependencies: ["RankiBase"],
  parser: (specs) => getLevel(specs, "3-frame-v1"),
};

function expandDependencies(plugins: ParserPlugin[]): void {
  const lookup = Object.fromEntries(plugins.map((p) => [p.name, p]));

  const cache = new Map<string, Set<string>>();

  function getAllDeps(name: string, visited = new Set<string>()): Set<string> {
    if (cache.has(name)) return cache.get(name)!;
    if (visited.has(name))
      throw new Error(`CIRCULAR DEPENDENCY involving ${name}`);

    visited.add(name);
    const plugin = lookup[name];
    const result = new Set<string>();

    for (const dep of plugin.dependencies) {
      if (!lookup[dep]) throw new Error(`DEPENDENCY ABSENT ${dep}`);
      result.add(dep);
      for (const transitive of getAllDeps(dep, visited)) {
        result.add(transitive);
      }
    }

    cache.set(name, result);
    visited.delete(name);
    return result;
  }

  // Mutate each plugin.dependencies to include transitive deps
  plugins.forEach((p) => {
    p.dependencies = Array.from(getAllDeps(p.name));
  });
}

function topologicalSort(plugins: ParserPlugin[]): ParserPlugin["name"][] {
  const sorted: string[] = [];
  const adjacencies = plugins.reduce((a, c) => {
    a[c.name] = new Set();
    return a;
  }, {} as Record<string, Set<string>>);

  plugins.forEach((p) => {
    p.dependencies.forEach((d) => {
      if (!adjacencies.hasOwnProperty(d)) {
        throw new Error(`DEPENDENCY ABSENT ${d}`);
      }
      adjacencies[d].add(p.name);
    });
  });

  const counts = Object.keys(adjacencies).reduce((a, c) => {
    a[c] = 0;
    return a;
  }, {} as Record<string, number>);

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

const IMPORTED_PLUGINS = {
  richTextParserPlugin,
  frameV2ParserPlugin,
  paramsV2ParserPlugin,
  baseParserPlugin,
  configParserPlugin,
  richNumberParserPlugin,
  richStructureParserPlugin,
  frameV1ParserPlugin,
};

const STANDARD_PLUGIN_NAMES = ["RankiConfig", "RankiBase"];

function parse(
  context: ParseContext,
  requestedPluginNames: string[],
  raw: string,
) {
  const activePluginNames = [...STANDARD_PLUGIN_NAMES, ...requestedPluginNames];
  const { versionPath, semver } = getVersionData(OHM_PATH);
  const activePluginNamesSet = new Set(activePluginNames);

  {
    const importedPluginNameSet = new Set(
      Object.values(IMPORTED_PLUGINS).map((v) => v.name),
    );
    for (const name of activePluginNames) {
      if (!importedPluginNameSet.has(name)) {
        throw new Error(`REQUESTED PLUGIN NOT IMPORTED: ${name}`);
      }
    }
  }

  const activePluginsObj = Object.entries(IMPORTED_PLUGINS)
    .filter(([_, v]) => activePluginNamesSet.has(v.name))
    .reduce(
      (a, [k, v]) => ((a[k] = v), a),
      {} as Partial<typeof IMPORTED_PLUGINS>,
    );

  if (!Object.keys(activePluginsObj).length) {
    throw new Error("NO ENABLED PLUGINS");
  }

  const activePluginsArr = Object.values(activePluginsObj);

  expandDependencies(activePluginsArr);
  const importChain = topologicalSort(activePluginsArr);
  const dependencyGraph = activePluginsArr.reduce(
    (a, v) => ((a[v.name] = v.dependencies), a),
    {} as Record<string, string[]>,
  );

  const matchers = {};
  let grammarParents = {};
  for (let si = 0; si < importChain.length; si++) {
    const name = importChain[si];
    const plugin = Object.values(activePluginsObj).find((p) => p.name === name);
    if (!plugin) {
      throw new Error(`CANNOT FIND PLUGIN ${name}`);
    }
    const matcher = plugin.parser({
      versionPath,
      parentGrammar: si === 0 ? "" : importChain[si - 1],
      dependencies: grammarParents,
    });
    matchers[name] = matcher;
    grammarParents = {
      ...grammarParents,
      [name]: matcher.grammar,
    };
  }

  const last = importChain.at(-1);
  const matcher = matchers[last].grammar;

  if (!matcher) {
    throw new Error("CANNOT DEDUCE MATCHER");
  }

  const { semantics, participants, methods } = compileOperations(
    matcher.createSemantics(),
    activePluginNames,
    {
      RankiBase: baseActions,
      RankiRichText: richTextActions,
      RankiParamsV2: paramsV2Actions,
      RankiFrameV2: frameV2Actions,
      RankiRichNumber: richNumberActions,
      RankiRichStructure: richStructureActions,
      RankiFrameV1: frameV1Actions,
    },
  );

  const matched = matcher.match(raw, "root");

  return {
    report: {
      language: {
        version: semver,
        // context,
      },
      parser: {
        requested: requestedPluginNames,
        importChain,
        dependencyGraph,
      },
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

export const context: ParseContext = {
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
    richNumberV1: {
      complexUnits: ["i", "j", "k"],
      infinity: ["inf", "INF"],
      pi: ["pi", "PI"],
      e: ["e", "E"],
      hexadecimal: ["x", "X"],
      octal: ["o", "O"],
      binary: ["b", "B"],
      decimal: ".",
      negative: "-",
      group: "_",
    },
  },
  methods: {
    parser: (p) => parse,
  },
};
