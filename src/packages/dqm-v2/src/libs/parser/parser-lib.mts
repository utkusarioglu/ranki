import type { IDqmPluginParser } from "@ranki/package-dqm-api-v2";
import { DqmError } from "@ranki/package-utils";
import type { ILibParser, T, Criteria } from "./parser-lib.types.mjs";

export class ParserLib implements ILibParser {
  private plugins = new Map<string, T>();

  add(plugin: IDqmPluginParser): ILibParser {
    if (this.plugins.has(plugin.meta.name)) {
      throw new DqmError("PLUGIN_ALREADY_DEFINED", {
        list: this.plugins,
        plugin,
      });
    }
    this.plugins.set(plugin.meta.name, plugin);
    return this;
  }

  get(criteria: Criteria): IDqmPluginParser {
    // @ts-expect-error
    return this.plugins.get(criteria)!;
  }
}
