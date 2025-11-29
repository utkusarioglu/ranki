import type { IDqmPluginComponentSet } from "./component/component-set.types.mjs";

export type IDqmPlugin = (IDqmPluginComponentSet | IDqmPluginParser)[];

export type IDqmPluginExtends = { type: string };

export interface IDqmPluginParser {
  type: "parser";
  meta: {
    name: string;
    description: string;
    version: string;
  };
}
