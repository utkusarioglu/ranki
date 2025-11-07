import type {
  ValidationNodeParent,
  ComponentPluginComponent,
  ReducedTransformNode,
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
    transform: (v) => {
      if (v.kind === "leaf") {
        console.log("err:", v);
        throw new Error(`CODE COMPONENT CANNOT BE A LEAF`);
      }
      if (v.children.length > 1) {
        throw new Error("SINGLE CHILD EXPECTED");
      }
      const v2Payload = v.children[0] as ValidationNodeParent;
      if (v2Payload.children.length > 1) {
        throw new Error("SINGLE CHILD EXPECTED");
      }
      const pauseList = v2Payload.children[0] as ValidationNodeParent;
      const v2PayloadSections = pauseList.children;

      const all: ReducedTransformNode[] = [];
      v2PayloadSections.forEach((c) => {
        switch (c.creator) {
          case "v2PayloadSection":
            // return {
            //   hoist: c.shape.hoist,
            //   // TODO using trim here is not right
            //   content: c.source.raw.trim(),
            // };
            all.push({
              tag: "code",
              kind: "leaf" as "leaf",
              print: true,
              // creator: validation.creator,
              // depth: validation.shape.depth.total,
              hoist: c.shape.hoist,
              // TODO using trim here is not right
              source: {
                type: "raw",
                raw: c.source.raw.trim(),
              },
              // source: {
              //   type: "raw" as "raw",
              //   raw: content,
              // },
            });
            break;
          case "pausedContainer":
            if (c.kind !== "parent") {
              throw new Error("PAUSED CONTAINER IS EXPECTED TO BE A PARENT");
            }
            const transformed = c.context.parseTransform(c.children[0]);
            if (transformed === null) {
              throw new Error("NULL TRANSFORM NODE NOT EXPECTED");
            }
            transformed.forEach((t) => {
              t.hoist = c.shape.hoist;
            });
            all.push(...transformed);
            break;

          default:
            throw new Error(`UNRECOGNIZED CREATOR: ${c.creator}`);
        }
      });

      console.log(all);
      return v.context.newTransformNode(v, all);
    },
  },
};
