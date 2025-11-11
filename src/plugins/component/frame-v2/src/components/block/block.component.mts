import type { ComponentPluginComponent } from "@ranki/package-api-v2";
import { placeholder } from "../../placeholder.mjs";
import { transformList } from "./block.transformer.mjs";
// import { v2_fp } from "../../transfor/code.transformer.mjs";
// import { transform } from "../../transformers/main.mjs";

export const blockV2Component: ComponentPluginComponent = {
  chain: ["frame", "v2", "block"],
  aliases: [],
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocess: (c) => c,
    ast: {
      directives: [
        // {
        // plugins: {
        //   requested: [
        //     "RankiParamsV2",
        //     "RankiFrameV2",
        //     // "RankiRichNumberV2",
        //     // "RankiBaseV2",
        //     // "RankiConstantsV2",
        //   ],
        // },
        // },
      ],
      params: {
        setting: {
          positional: [],
          shorthands: {},
        },
        directive: {
          positional: [],
          shorthands: {},
        },
      },
    },
    validator: placeholder,
    transformers: {
      root: "",
      list: transformList,
    },
  },
};
