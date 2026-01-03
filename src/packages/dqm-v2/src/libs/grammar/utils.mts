import type { IDqmPluginGrammar, PluginUrn } from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";
import { Serialize } from "../../utils/serialize.mjs";
import { PluginFilter } from "../../utils/plugin.mjs";

// ANKI
export function expandDependencies(plugins: IDqmPluginGrammar[]): void {
  const lookup = Object.fromEntries(
    plugins.map((p) => [Serialize.grammarName(p), p]),
  );
  const cache = new Map<PluginUrn<"grammar">, Set<PluginUrn<"grammar">>>();

  function getAllDeps(
    name: PluginUrn<"grammar">,
    visited = new Set<PluginUrn<"grammar">>(),
  ): Set<PluginUrn<"grammar">> {
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
    const plugin = lookup[name];
    const result = new Set<PluginUrn<"grammar">>();
    const grammarDependencies = PluginFilter.grammars(plugin.dependencies);

    for (const dep of grammarDependencies) {
      if (!lookup[dep])
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

  // Mutate each plugin.dependencies to include transitive deps
  plugins.forEach((p) => {
    p.dependencies = Array.from(getAllDeps(Serialize.grammarName(p)));
  });
}

type AdjacencySet = Record<PluginUrn<"grammar">, Set<PluginUrn<"grammar">>>;

// ANKI
export function topologicalSort(
  plugins: IDqmPluginGrammar[],
): PluginUrn<"grammar">[] {
  const sorted: PluginUrn<"grammar">[] = [];
  const adjacencies: AdjacencySet = Object.fromEntries(
    plugins.map((p) => [Serialize.grammarName(p), new Set()]),
  );

  plugins.forEach((p) => {
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

  plugins.map(Serialize.grammarName).forEach((n) => {
    for (let a of adjacencies[n]) {
      counts[a]++;
    }
  });

  const queue = Object.entries(counts)
    .filter(([_k, v]) => !v)
    .map(([k, _v]) => k) as PluginUrn<"grammar">[];

  while (queue.length) {
    const curr = queue.shift()!;
    sorted.push(curr);

    for (let n of adjacencies[curr]) {
      if (--counts[n] === 0) {
        queue.push(n);
      }
    }
  }

  if (sorted.length !== plugins.length) {
    throw new DqmAppError({
      code: "CIRCULAR_DEPENDENCY",
      why: "Circular dependencies prevent determining a viable grammar inheritance chain",
      cause: null,
      details: {
        sorted,
        plugins,
      },
    });
  }

  return sorted;
}
