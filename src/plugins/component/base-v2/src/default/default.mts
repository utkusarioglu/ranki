import type { IDqmComponent } from "@ranki/package-dqm-api-v2";
// import { transformList } from "./transforms.mjs";

// const placeholder: any = (validation) => ({
//   warnings: [["COMPONENT VALIDATION", validation.kind].join(" ")],
//   errors: [],
// });

export const baseDefault: IDqmComponent = {
  type: "component",
  meta: {
    id: {
      chain: ["base", "v2", "default"],
      aliases: [],
    },
    description: "Provides default component structure for BaseV2",
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
