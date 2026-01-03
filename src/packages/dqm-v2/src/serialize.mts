import type {
  DqmPluginName,
  DqmPluginParserName,
  IDqmPluginTypeNames,
  PluginUrn,
} from "@dqm/package-dqm-api-v2";

export class Serialize {
  static grammarName(type: string, name: string): DqmPluginParserName {
    return [type, name].join(":");
  }

  static getPluginName<T extends IDqmPluginTypeNames>(
    pluginUrn: PluginUrn<T>,
  ): DqmPluginName {
    return pluginUrn.split(":").at(-1)!;
  }
}
