import type {
  ValidationNodeParent,
  // ValidationNodeLeaf,
  ComponentPluginComponent,
} from "@ranki/package-api-v2";
import { placeholder } from "../../placeholder.mjs";

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
    transform: (validation) => {
      if (validation.kind === "leaf") {
        console.log("err:", validation);
        throw new Error(`CODE COMPONENT CANNOT BE A LEAF`);
      }
      if (validation.children.length > 1) {
        throw new Error("SINGLE CHILD EXPECTED");
      }
      const v2Payload = validation.children[0] as ValidationNodeParent;
      if (v2Payload.children.length > 1) {
        throw new Error("SINGLE CHILD EXPECTED");
      }
      console.log(v2Payload);
      const pauseList = v2Payload.children[0] as ValidationNodeParent;
      const v2PayloadSections = pauseList.children;

      const content = v2PayloadSections
        .map((c) => {
          switch (c.creator) {
            case "v2PayloadSection":
              return c.source.raw;
            case "pausedContainer":
              console.log("paused", c);
              break;
            default:
              throw new Error(`UNRECOGNIZED CREATOR: ${c.creator}`);
          }
        })
        .join("");

      const ob = {
        tag: "code",
        kind: "leaf" as "leaf",
        print: true,
        creator: validation.creator,
        depth: validation.shape.depth.total,
        source: {
          type: "raw" as "raw",
          raw: content,
        },
      };
      return ob;
    },
  },
};
