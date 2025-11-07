import type {
  ComponentPluginValidationFunc,
  ComponentPluginComponent,
} from "@ranki/package-api-v2";
import { transform } from "../transform/all.mjs";

const placeholder: ComponentPluginValidationFunc = (validation) => ({
  warnings: [["COMPONENT VALIDATION", validation.kind].join(" ")],
  errors: [],
});

export const rankiBaseDefault: ComponentPluginComponent = {
  chain: "default",
  stages: {
    // DO NOT DO TRIMMING HERE, DO THAT IN TRANSFORM.
    // THIS IS FOR GETTING RID OF HTML ENCODING AND SUCH AT THE COMPONENT LEVEL
    preprocess: (c) => c,
    ast: {
      directives: [
        // {
        // plugins: {
        // requested: null,
        // requested: [
        // "RankiParamsV2",
        // "RankiRichStructureV2",
        // "RankiRichNumberV2",
        // ],
        // standards: ["RankiBaseV2", "RankiConstantsV2"],
        // },
        // content: {
        //   prefix: "% ignore \n",
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
    transform,
  },
};
