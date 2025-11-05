import type {
  RankiPluginComponent,
  ComponentPluginValidationFunc,
} from "@ranki/package-api-v2";
import { root_structure } from "../transform/root_structure.mjs";

const placeholder: ComponentPluginValidationFunc = (validation) => ({
  warnings: [["COMPONENT VALIDATION", validation.kind].join(" ")],
  errors: [],
});

export const rankiBaseDefault: RankiPluginComponent["list"][0] = {
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
    transform: root_structure,
    // transform: (root_structure) => {
    //   console.log("hit", root_structure);
    //   if (root_structure.kind === "leaf") {
    //     throw new Error(`CODE COMPONENT CANNOT BE A LEAF`);
    //   }
    //   const payload = root_structure.children[0];
    //   const pauseList = (payload as ValidationNodeParent).children[0];

    //   const payloadSection = (pauseList as ValidationNodeParent).children[0];
    //   const payloadPlain = (payloadSection as ValidationNodeParent).children[0];
    //   const rootIgnore = (payloadPlain as ValidationNodeParent)
    //     .children[0] as ValidationNodeLeaf;

    //   const raw = rootIgnore.source.raw;

    //   const ob = {
    //     tag: "span",
    //     kind: "leaf" as "leaf",
    //     print: true,
    //     creator: root_structure.creator,
    //     depth: root_structure.shape.depth.total,
    //     source: {
    //       type: "raw" as "raw",
    //       raw,
    //     },
    //   };
    //   return ob;
    // },
  },
};
