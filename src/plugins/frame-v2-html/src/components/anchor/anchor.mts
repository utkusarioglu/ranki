import type { IDqmComponent } from "@dqm/package-dqm-api-v2";
import { transformers } from "./transformers.mjs";

export interface HtmlPrimitiveAnchorComponentConfig {
  default: {
    attribute: {
      href: string;
      target: string;
    };
  };
  // path: {
  //   cat: [number, string, boolean];
  // };
}

const PLUGIN_PATH = ["plugins", "config", "grammar:FrameV2"];

export const frameV2AnchorComponent: IDqmComponent<HtmlPrimitiveAnchorComponentConfig> =
  {
    type: "component",
    meta: {
      id: {
        chain: ["frame", "v2", "anchor"],
        aliases: ["a"],
      },
      description: "Html anchor element",
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
            attribute: {
              href: "https://www.google.com",
              target: "_blank",
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
          positionals: [
            ["attribute", "href"],
            ["attribute", "target"],
          ],
          params: [
            {
              id: {
                chain: ["attribute", "href"],
                aliases: ["h"],
              },
            },
            {
              id: {
                chain: ["attribute", "target"],
                aliases: ["t"],
              },
            },
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
