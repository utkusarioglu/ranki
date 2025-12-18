import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";
import { DqmAppError } from "../../errors/dqm-app-error/dqm-app-error.mjs";

// ANKI
export function expandDependencies(plugins: IDqmPluginGrammar[]): void {
  const lookup = Object.fromEntries(
    plugins.map((p) => [[p.type, p.meta.name].join(":"), p]),
  );
  const cache = new Map<string, Set<string>>();

  function getAllDeps(name: string, visited = new Set<string>()): Set<string> {
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
    const result = new Set<string>();

    for (const dep of plugin.dependencies) {
      if (!lookup[dep])
        throw new DqmAppError({
          code: "DEPENDENCY_ABSENT",
          why: "Plugin hints at a dependency that hasn't been installed",
          details: {
            pluginName: plugin.meta.name,
            pluginType: plugin.type,
            missingDependency: dep,
            pluginReportedDependencies: Array.from(plugin.dependencies),
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
    p.dependencies = Array.from(getAllDeps([p.type, p.meta.name].join(":")));
  });
}

// ANKI
export function topologicalSort(
  plugins: IDqmPluginGrammar[],
): IDqmPluginGrammar["meta"]["name"][] {
  const sorted: string[] = [];
  const adjacencies = plugins.reduce((a, c) => {
    const urn = [c.type, c.meta.name].join(":");
    a[urn] = new Set();
    return a;
  }, {} as Record<string, Set<string>>);

  plugins.forEach((p) => {
    p.dependencies.forEach((d) => {
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
      const urn = [p.type, p.meta.name].join(":");
      adjacencies[d].add(urn);
    });
  });

  const counts = Object.keys(adjacencies).reduce((a, c) => {
    a[c] = 0;
    return a;
  }, {} as Record<string, number>);

  plugins
    .map((p) => [p.type, p.meta.name].join(":"))
    .forEach((n) => {
      for (let a of adjacencies[n]) {
        counts[a]++;
      }
    });

  const queue = Object.entries(counts)
    .filter(([_k, v]) => !v)
    .map(([k, _v]) => k);

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
