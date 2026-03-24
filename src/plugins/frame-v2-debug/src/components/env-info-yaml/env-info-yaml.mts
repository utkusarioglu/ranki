import type {
  IComponentCustomizationConfig,
  IDqmComponent,
} from "@dqm/package-dqm-api-v2";
import { transformers } from "./transformers.mjs";
import { examples } from "./examples/examples.mjs";

interface ComponentType extends IComponentCustomizationConfig {
  default: {
    // language: {
    //   name: string;
    // };
    // prettier: {
    //   auto_format: boolean;
    // };
    // path: {
    //   cat: [number, string, boolean];
    // };
    content: {
      no_empty_lines: boolean;
    };
  };
}

// @ts-expect-error
const PLUGIN_PATH = ["plugins", "config", "grammar:FrameV2"];

export const environmentInfoYaml: IDqmComponent<ComponentType> = {
  type: "component",
  meta: {
    id: {
      chain: ["frame", "v2", "debug", "env_info", "yaml"],
      aliases: [],
    },
    description:
      "Prints information about the environment of the language instance in yaml format",
    version: "0.0.0",
    examples,
  },
  customizations: {
    // TODO you need a settings object here to tell how component wants to handle missing params etc
    config: {
      dqm: [
        {
          content: {
            trim: false,
            prefix: "",
            suffix: "",
          },
        },
      ],
      component: {
        default: {
          content: {
            no_empty_lines: true,
          },
          // language: {
          //   name: "</>",
          // },
          // prettier: {
          //   auto_format: true,
          // },
          // path: {
          //   cat: [1, "def", false],
          // },
        },
      },
    },
    params: {
      $: {
        positionals: [],
        params: [
          // {
          //   id: {
          //     chain: ["content", "prefix"],
          //     aliases: ["p"],
          //   },
          // },
          // {
          //   id: {
          //     chain: [...PLUGIN_PATH, "tokens", "opener"],
          //     aliases: ["o"],
          //   },
          // },
          // {
          //   id: {
          //     chain: [...PLUGIN_PATH, "tokens", "closer"],
          //     aliases: ["c"],
          //   },
          // },
        ],
      },
      default: {
        positionals: [
          // ["language", "name"],
          // ["prettier", "auto_format"],
        ],
        params: [
          // {
          //   id: {
          //     chain: ["language", "name"],
          //     aliases: ["l"],
          //   },
          // },
          // {
          //   id: {
          //     chain: ["prettier", "auto_format"],
          //     aliases: ["p"],
          //   },
          // },
          // {
          //   id: {
          //     chain: ["path", "cat"],
          //     aliases: ["h"],
          //   },
          // },
        ],
      },
    },
  },
  /**
   * THis is where you check whether a particular component wants to be the
   * sole host of a cpx. such as `placeholder`.
   *
   * There should be a common library of validations. a callback
   * `soleComponent` could be added here to check whether the cpx only contains
   * a single cps.
   */
  validation: [
    // (c) => {
    //   console.log("val", c.getId());
    // },
  ],
  transformers,
};
