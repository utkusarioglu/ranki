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
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocessing: (c) => c,
    ast: {
      configs: {
        positionals: [],
        params: [],
      },
      settings: {
        positionals: [],
        params: [],
      },
    },
  },
};
