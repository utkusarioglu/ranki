import type { IDqmPluginComponentSet } from "@ranki/package-dqm-api-v2";
import { baseDefault } from "./default/default.mjs";

export const baseV2Components: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "BaseV2",
    version: "0.0.0",
    description: "Provides the default set for BaseV2",
  },
  list: [baseDefault],
};
