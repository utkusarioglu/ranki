import type { IDqmComponent } from "@dqm/package-dqm-api-v2";

interface ComponentType {
  prettier: {
    auto_format: boolean;
  };
  path: {
    cat: [number, string, boolean];
  };
}

const PLUGIN_PATH = ["plugins", "config", "grammar:FrameV2"];

export const frameV2CodeBlockComponent: IDqmComponent<ComponentType> = {
  type: "component",
  meta: {
    id: {
      chain: ["frame", "v2", "code"],
      aliases: ["code"],
    },
    description: "Component that understands computer code",
    version: "0.0.0",
  },
  customizations: {
    // TODO you need a settings object here to tell how component wants to handle missing params etc
    config: {
      dqm: [
        {
          content: {
            trim: true,
            prefix: "",
            suffix: "",
          },
        },
      ],
      component: {
        default: {
          prettier: {
            auto_format: true,
          },
          path: {
            cat: [1, "def", false],
          },
        },
      },
    },
    params: {
      $: {
        positionals: [],
        params: [
          {
            id: {
              chain: ["content", "prefix"],
              aliases: ["p"],
            },
          },
          {
            id: {
              chain: [...PLUGIN_PATH, "tokens", "opener"],
              aliases: ["o"],
            },
          },
          {
            id: {
              chain: [...PLUGIN_PATH, "tokens", "closer"],
              aliases: ["c"],
            },
          },
        ],
      },
      default: {
        positionals: [["prettier", "auto_format"]],
        params: [
          {
            id: {
              chain: ["prettier", "auto_format"],
              aliases: ["p"],
            },
          },
          {
            id: {
              chain: ["path", "cat"],
              aliases: ["h"],
            },
          },
        ],
      },
    },
  },
  validation: [
    // (c) => {
    //   console.log("val", c.getId());
    // },
  ],
  transformers: {},
};
