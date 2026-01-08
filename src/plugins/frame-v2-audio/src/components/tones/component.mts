import type {
  IComponentCustomizationConfig,
  IDqmComponent,
} from "@dqm/package-dqm-api-v2";
import { transformers } from "./transformers.mjs";

interface ComponentType extends IComponentCustomizationConfig {
  default: {
    prettier: {
      auto_format: boolean;
    };
    path: {
      cat: [number, string, boolean];
    };
  };
}

const PLUGIN_PATH = ["plugins", "config", "grammar:FrameV2"];

export const tones: IDqmComponent<ComponentType> = {
  type: "component",
  meta: {
    id: {
      chain: ["frame", "v2", "audio", "audio-context", "tone-js", "tones"],
      aliases: ["tones"],
    },
    description: "Creates synth tones based on simple input",
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
