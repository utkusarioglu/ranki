import type {
  GrammarDictSet,
  GrammarList,
  GrammarMapSet,
  GrammarSet,
  PluginDictionary,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";
import { Serialize } from "../../../utils/serialize.mjs";
import { DqmAppError } from "../../../errors/dqm-app-error/dqm-app-error.mjs";
import { PluginFilter } from "../../../utils/plugin.mjs";

export class GrammarPluginUtils {
  static sort(plugins: PluginDictionary) {
    this.expandDependencies(plugins);
    return this.topologicalSort(plugins);
  }

  // ANKI
  private static expandDependencies(plugins: PluginDictionary): void {
    const cache: GrammarMapSet = new Map();

    function getAllDeps(
      name: PluginUrn<"grammar">,
      visited: GrammarSet = new Set(),
    ): GrammarSet {
      if (cache.has(name)) return cache.get(name)!;
      if (visited.has(name))
        throw new DqmAppError({
          code: "CIRCULAR_DEPENDENCY",
          why: "Circular dependencies prevent determining a viable grammar inheritance chain",
          cause: null,
          details: {
            name,
          },
        });

      visited.add(name);
      const plugin = plugins[name];
      const result: GrammarSet = new Set();
      const grammarDependencies = PluginFilter.grammars(plugin.dependencies);

      for (const dep of grammarDependencies) {
        if (!plugins[dep])
          throw new DqmAppError({
            code: "DEPENDENCY_ABSENT",
            why: "Plugin hints at a dependency that hasn't been installed",
            details: {
              pluginName: plugin.meta.name,
              pluginType: plugin.type,
              missingDependency: dep,
              pluginReportedDependencies: grammarDependencies,
            },
            cause: null,
          });
        result.add(dep);
        for (const transitive of getAllDeps(dep, visited)) {
          result.add(transitive);
        }
      }

      cache.set(name, result);
      visited.delete(name);
      return result;
    }

    Object.values(plugins).forEach((p) => {
      p.dependencies = Array.from(getAllDeps(Serialize.grammarName(p)));
    });
  }

  // ANKI
  private static topologicalSort(plugins: PluginDictionary): GrammarList {
    const sorted: GrammarList = [];
    const adjacencies: GrammarDictSet = Object.fromEntries(
      Object.keys(plugins).map((n) => [n, new Set()]),
    );

    Object.values(plugins).forEach((p) => {
      PluginFilter.grammars(p.dependencies).forEach((d) => {
        if (!adjacencies.hasOwnProperty(d)) {
          throw new DqmAppError({
            code: "DEPENDENCY_ABSENT",
            why: "Plugin hints at a dependency that hasn't been installed",
            details: {
              pluginName: p.meta.name,
              pluginType: p.type,
              missingDependency: d,
              pluginReportedDependencies: Array.from(p.dependencies),
              adjacencies,
            },
            cause: null,
          });
        }
        adjacencies[d].add(Serialize.grammarName(p));
      });
    });

    const counts = Object.fromEntries(
      Object.keys(adjacencies).map((k) => [k, 0]),
    );

    Object.values(plugins)
      .map(Serialize.grammarName)
      .forEach((n) => {
        for (let a of adjacencies[n]) {
          counts[a]++;
        }
      });

    const queue = Object.entries(counts)
      .filter(([_k, v]) => !v)
      .map(([k, _v]) => k) as GrammarList;

    while (queue.length) {
      const curr = queue.shift()!;
      sorted.push(curr);

      for (let n of adjacencies[curr]) {
        if (--counts[n] === 0) {
          queue.push(n);
        }
      }
    }

    if (sorted.length !== Object.keys(plugins).length) {
      throw new DqmAppError({
        code: "CIRCULAR_DEPENDENCY",
        why: "Circular dependencies prevent determining a viable grammar inheritance chain",
        cause: null,
        details: {
          sorted,
          dict: plugins,
        },
      });
    }

    return sorted;
  }
}
