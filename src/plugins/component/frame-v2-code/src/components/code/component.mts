import type { ComponentPluginComponent } from "@ranki/package-api-v2";
import { placeholder } from "../../placeholder.mjs";
import { transformList } from "./transformer.mjs";
// import { v2_fp } from "../../transfor/code.transformer.mjs";
// import { transform } from "../../transformers/main.mjs";

export const codeComponent: ComponentPluginComponent = {
  chain: ["frame", "v2", "computer_science", "code", "block"],
  aliases: ["code"],
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocess: (c) => c.replace("&trade;", "™"),
    ast: {
      directives: [
        {
          // @ts-ignore
          plugins: {
            requested: [
              "RankiParamsV2",
              "RankiFrameV2",
              // "RankiRichNumberV2",
              // "RankiBaseV2",
              // "RankiConstantsV2",
            ],
            // config: {
            //   RankiFrameV2: {
            //     tokens: {
            //       opener: "-[",
            //       closer: "]-",
            //     },
            //   },
            // },
          },
        },
      ],
      params: {
        setting: {
          positional: [["language"], ["path"]],
          shorthands: {
            b: ["cat", "dog"],
          },
        },
        directive: {
          positional: [],
          shorthands: {
            p: ["content", "prefix"],
            r: ["plugins", "requested"],
            o: ["plugins", "config", "RankiFrameV2", "tokens", "opener"],
            c: ["plugins", "config", "RankiFrameV2", "tokens", "closer"],
          },
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
