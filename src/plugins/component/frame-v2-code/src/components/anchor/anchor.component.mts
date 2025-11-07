import type { ComponentPluginComponent } from "@ranki/package-api-v2";
import { placeholder } from "../../placeholder.mjs";
// import { transform } from "../../transform.mjs";
import { anchor } from "./anchor.transform.mjs";

export const anchorComponent: ComponentPluginComponent = {
  chain: "anchor",
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocess: (c) => c,
    ast: {
      directives: [
        {
          // @ts-expect-error
          plugins: {
            // requested: [
            //   "RankiParamsV2",
            //   "RankiFrameV2",
            //   "RankiRichNumberV2",
            //   "RankiBaseV2",
            //   "RankiConstantsV2",
            // ],
          },
        },
      ],
      params: {
        setting: {
          positional: [["href"], ["target"]],
          shorthands: {
            // b: ["cat", "dog"],
          },
        },
        directive: {
          positional: [],
          shorthands: {
            // p: ["content", "prefix"],
            // r: ["plugins", "requested"],
          },
        },
      },
    },
    validator: placeholder,
    transform: anchor,
  },
};
