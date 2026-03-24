import type {
  IComponentCustomizationConfig,
  IDqmComponent,
} from "@dqm/package-dqm-api-v2";
import { transformers } from "./transformers.mjs";
import { examples } from "./examples/examples.mjs";

interface ComponentType extends IComponentCustomizationConfig {
  default: {
    content: {
      no_empty_lines: boolean;
    };
    font: {
      size: string; // CSS length unit
      line_height: string; // CSS length unit
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
          font: {
            size: "", // "" means css takes charge
            line_height: "", // "" means css takes charge
          },
        },
      },
    },
    params: {
      $: {
        positionals: [],
        params: [],
      },
      default: {
        positionals: [],
        params: [
          {
            id: {
              chain: ["font", "size"],
              aliases: [],
            },
          },
          {
            id: {
              chain: ["font", "line_height"],
              aliases: [],
            },
          },
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
