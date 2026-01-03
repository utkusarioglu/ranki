import type {
  DqmPluginName,
  IDqmPluginGrammar,
  IDqmPluginTypeNames,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";

export class Serialize {
  static grammarName(p: IDqmPluginGrammar): PluginUrn<"grammar"> {
    return `grammar:${p.meta.name}`;
  }

  static getPluginName<T extends IDqmPluginTypeNames>(
    pluginUrn: PluginUrn<T>,
  ): DqmPluginName {
    return pluginUrn.split(":").at(-1)!;
  }
}
