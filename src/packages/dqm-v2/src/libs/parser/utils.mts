import type { IDqmPluginGrammar } from "@dqm/package-dqm-api-v2";

// ANKI
export function expandDependencies(plugins: IDqmPluginGrammar[]): void {
  const lookup = Object.fromEntries(plugins.map((p) => [p.meta.name, p]));
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
    p.dependencies = Array.from(getAllDeps(p.meta.name));
  });
}

// ANKI
export function topologicalSort(
  plugins: IDqmPluginGrammar[],
): IDqmPluginGrammar["meta"]["name"][] {
  const sorted: string[] = [];
  const adjacencies = plugins.reduce((a, c) => {
    a[c.meta.name] = new Set();
    return a;
  }, {} as Record<string, Set<string>>);

  plugins.forEach((p) => {
    p.dependencies.forEach((d) => {
      if (!adjacencies.hasOwnProperty(d)) {
        throw new Error(`DEPENDENCY ABSENT ${d}`);
      }
      adjacencies[d].add(p.meta.name);
    });
  });

  const counts = Object.keys(adjacencies).reduce((a, c) => {
    a[c] = 0;
    return a;
  }, {} as Record<string, number>);

  plugins
    .map((p) => p.meta.name)
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
    if (!curr) {
      throw new Error("curr NOT DEFINED");
    }
    sorted.push(curr);

    for (let n of adjacencies[curr]) {
      if (--counts[n] === 0) {
        queue.push(n);
      }
    }
  }

  if (sorted.length !== plugins.length) {
    console.warn(sorted, plugins);
    throw new Error("CIRCULAR PLUGIN DEPENDENCY");
  }

  return sorted;
}
