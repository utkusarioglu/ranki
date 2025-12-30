import type { IDqmComponent } from "@dqm/package-dqm-api-v2";

export const baseDefault: IDqmComponent = {
  type: "component",
  meta: {
    id: {
      chain: ["base", "v2", "default"],
      aliases: [],
    },
    description: "Default component for all BaseV2 subtree",
    version: "0.0.0",
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
  // stages: {
  //   // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
  //   // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
  //   preprocessing: (c) => c,
  // },
};
