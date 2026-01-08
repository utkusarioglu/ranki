import type { IDqmComponent } from "@dqm/package-dqm-api-v2";
import { transformers } from "./transformers.mjs";
import { examples } from "./examples/examples.mjs";

export const baseDefault: IDqmComponent = {
  type: "component",
  meta: {
    id: {
      chain: ["base", "v2", "default"],
      aliases: [],
    },
    description: "Default component for all BaseV2 subtree",
    version: "0.0.0",
    examples,
  },
  customizations: {
    config: {
      component: {
        default: {},
      },
    },
    params: {
      $: {
        positionals: [],
        params: [],
      },
      default: {
        positionals: [],
        params: [],
      },
    },
  },
  validation: [],
  transformers,
};
