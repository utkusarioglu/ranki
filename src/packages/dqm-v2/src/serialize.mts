import type { DqmPluginParserName } from "@dqm/package-dqm-api-v2";

export class Serialize {
  static grammarName(type: string, name: string): DqmPluginParserName {
    return [type, name].join(":");
  }
}
