import type { PluginUrn } from "@dqm/package-dqm-api-v2";

export class PluginFilter {
  static grammars(p: PluginUrn[]): PluginUrn<"grammar">[] {
    return p.filter((p) => p.startsWith("grammar")) as PluginUrn<"grammar">[];
  }
}
