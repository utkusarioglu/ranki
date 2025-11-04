import type {
  RankiPluginComponent,
  ComponentPluginValidationFunc,
  ValidationNodeParent,
  ValidationNodeLeaf,
} from "@ranki/package-api-v2";

const placeholder: ComponentPluginValidationFunc = (validation) => ({
  warnings: [["CODE_COMPONENT VALIDATION", validation.kind].join(" ")],
  errors: [],
});

export const rankiFrameV2ComponentsPluginDom: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2Dom",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [
    {
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
                  "RankiRichNumberV2",
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

          const payload = validation.children[0];
          const pauseList = (payload as ValidationNodeParent).children[0];

          const payloadSection = (pauseList as ValidationNodeParent)
            .children[0];
          const payloadPlain = (payloadSection as ValidationNodeParent)
            .children[0];
          const rootIgnore = (payloadPlain as ValidationNodeParent)
            .children[0] as ValidationNodeLeaf;

          const raw = rootIgnore.source.raw;

          const ob = {
            tag: "code",
            kind: "leaf" as "leaf",
            print: true,
            creator: validation.creator,
            depth: validation.shape.depth.total,
            source: {
              type: "raw" as "raw",
              raw,
            },
          };
          return ob;
        },
      },
    },
    {
      chain: "a",
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
        transform: (validation) => {
          console.log("AAA");
          if (validation.kind === "leaf") {
            throw new Error(`Anchor COMPONENT CANNOT BE A PARENT`);
          }

          // const payload = validation.children[0];
          // const pauseList = (payload as ValidationNodeParent).children[0];

          // const payloadSection = (pauseList as ValidationNodeParent)
          //   .children[0];
          // const payloadPlain = (payloadSection as ValidationNodeParent)
          //   .children[0];
          // const rootIgnore = (payloadPlain as ValidationNodeParent)
          //   .children[0] as ValidationNodeLeaf;

          // const raw = rootIgnore.source.raw;

          const ob = {
            tag: "anchor",
            kind: "leaf" as "leaf",
            print: true,
            creator: validation.creator,
            depth: validation.shape.depth.total,
            source: {
              type: "raw" as "raw",
              raw: [
                "-",
                validation.source.raw[0].toUpperCase(),
                validation.source.raw.slice(1).toLocaleLowerCase(),
                ,
                "-",
              ].join(""),
            },
          };
          console.log({ ob });
          return ob;
        },
      },
    },
  ],
};
