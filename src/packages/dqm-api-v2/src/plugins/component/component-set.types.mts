import type { IDqmComponent } from "./component.types.mjs";

export interface IDqmPluginComponentSet {
  type: "component-set";
  meta: {
    name: string;
    description: string;
    version: string;
  };
  list: IDqmComponent[];
}
