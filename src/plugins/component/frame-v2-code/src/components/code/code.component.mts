import type { ComponentPluginComponent } from "@ranki/package-api-v2";
import { placeholder } from "../../placeholder.mjs";
import { v2_fp } from "./code.transformer.mjs";

export const codeComponent: ComponentPluginComponent = {
  chain: "code",
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocess: (c) => c.replace("&trade;", "™"),
    ast: {
      directives: [
        {
          // @ts-expect-error
          plugins: {
            requested: [
              "RankiParamsV2",
              "RankiFrameV2",
              // "RankiRichNumberV2",
              // "RankiBaseV2",
              // "RankiConstantsV2",
            ],
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
          },
        },
      },
    },
    validator: placeholder,
    transform: v2_fp,
  },
};
