import type { IDqmComponent } from "@dqm/package-dqm-api-v2";

export const frameV2ContainerComponent: IDqmComponent = {
  type: "component",
  meta: {
    id: {
      chain: ["frame", "v2", "container"],
      aliases: [],
    },
    description: "The container for all FrameV2 structures",
    version: "0.0.0",
  },
  customizations: {
    config: {
      component: {
        default: [{}],
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
  // stages: {
  //   // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
  //   // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
  //   preprocessing: (c) => c,
  //   // ast: {
  //   //   channels: {
  //   //   },
  //   // },
  // },
};
