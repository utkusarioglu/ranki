import type {
  RankiPluginParser,
  VersionReport,
  RankiLangParseHandlerFunction,
  ParserPluginsInstance,
  ProducedConfig,
  ActionsDictRecord,
} from "@ranki/package-api-v2";
import { expandDependencies, topologicalSort } from "./utils.mjs";

export class ParserPlugins implements ParserPluginsInstance {
  private list: RankiPluginParser[] = [];
  private handler: Record<string, RankiLangParseHandlerFunction> = {};

  getHandler(handlerName: string): RankiLangParseHandlerFunction {
    const found = this.handler[handlerName];
    if (!found) {
      throw new Error(`CANNOT FIND PARSE HANDLER: ${handlerName}`);
    }
    return found;
  }

  addPlugin(plugin: RankiPluginParser) {
    this.list.push(plugin);
    if (plugin.handler) {
      this.handler[plugin.meta.name] = plugin.handler;
    }
  }

  getList(): RankiPluginParser[] {
    return this.list;
  }

  find(name: string): RankiPluginParser {
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
      }
    }
    return missing;
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

  getActions(): ActionsDictRecord {
    return this.getList().reduce(
      (a, c) => ((a[c.meta.name] = c.actions()), a),
      {},
    );
  }

  produceConfig(): ProducedConfig {
    const config = this.list.reduce(
      (a, c) => ((a[c.meta.name] = c.config), a),
      {} as any,
    );
    const tokens = this.list.reduce(
      (a, c) => ((a[c.meta.name] = c.tokens), a),
      {} as any,
    );
    return {
      config,
      tokens,
    };
  }
}
