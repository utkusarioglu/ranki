import type { IDqmPlugin } from "@ranki/package-dqm-api-v2";
import { baseDefault } from "./default/default.mjs";

const baseV2: IDqmPlugin = [
  {
    type: "component-set",
    meta: {
      name: "BaseV2",
      version: "0.0.0",
      description: "Provides the default set for BaseV2",
    },
    list: [baseDefault],
  },
];

export default baseV2;
