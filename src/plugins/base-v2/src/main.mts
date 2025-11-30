import type { IDqmPlugin } from "@ranki/package-dqm-api-v2";
import { baseDefault } from "./components/default/default.mjs";

const baseV2: IDqmPlugin = [
  {
    type: "grammar",
    meta: {
      name: "BaseV2",
      description: "Default parser for RankiV2",
      version: "0.0.0",
    },
    dependencies: [],
    config: () => ({}),
    grammar: () => "",
    actions: () => ({}),
  },
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
