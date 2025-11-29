import * as ohm from "ohm-js";

export interface IDqmPluginParser<ConfigShape = {}> {
  type: "parser";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  dependencies: string[];
  config: ConfigShape;
  // paramParser:
  grammar: () => string;
  actions: () => Record<string, ohm.ActionDict<unknown>>;
  // validators:
}
