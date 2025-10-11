import type { RankiPluginParser, VersionReport } from "@ranki/package-api";

function expandDependencies(plugins: RankiPluginParser[]): void {
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

function topologicalSort(
  plugins: RankiPluginParser[],
): RankiPluginParser["meta"]["name"][] {
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

export class ParserPlugins {
  private list: RankiPluginParser[] = [];

  addPlugin(plugin: RankiPluginParser) {
    this.list.push(plugin);
  }

  getList(): RankiPluginParser[] {
    return this.list;
  }

  find(name: string) {
    const p = this.getList().find((p) => p.meta.name === name);
    if (!p) {
      throw new Error(`CANNOT FIND PLUGIN ${name}`);
    }
    return p;
  }

  count() {
    return this.list.length;
  }

  namesSet(): Set<string> {
    return new Set<string>(this.getList().map((v) => v.meta.name));
  }

  getVersions(): VersionReport {
    return this.list.reduce(
      (a, p) => ((a[p.meta.name] = p.meta.version), a),
      {},
    );
  }

  pickPlugins(set: Set<string>): RankiPluginParser[] {
    const activePluginsArr = this.getList().filter((v) => set.has(v.meta.name));
    return activePluginsArr;
  }

  checkMissing(set: Set<string>): string[] {
    const importedPluginNameSet = this.namesSet();
    const missing = [];
    for (const name of set) {
      if (!importedPluginNameSet.has(name)) {
        missing.push(name);
        // return false
        // throw new Error(`REQUESTED PLUGIN NOT IMPORTED: ${name}`);
      }
    }
    return missing;
    // return true;
  }

  sortPlugins(activePluginsArr: RankiPluginParser[]) {
    expandDependencies(activePluginsArr);
    const importChain = topologicalSort(activePluginsArr);
    return importChain;
  }

  dependencyGraph(
    activePluginsArr: RankiPluginParser[],
  ): Record<
    RankiPluginParser["meta"]["name"],
    RankiPluginParser["meta"]["name"][]
  > {
    const dependencyGraph = activePluginsArr.reduce(
      (a, v) => ((a[v.meta.name] = v.dependencies), a),
      {} as Record<string, string[]>,
    );
    return dependencyGraph;
  }

  getActions() {
    return this.getList().reduce(
      (a, c) => ((a[c.meta.name] = c.actions()), a),
      {},
    );
  }

  produceConfig(): Record<string, unknown> {
    return this.list.reduce(
      (a, c) => ((a[c.meta.name] = c.config), a),
      {} as any,
    );
  }
}
