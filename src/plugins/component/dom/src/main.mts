import type {
  RankiPluginComponent,
  ComponentPluginValidationFunc,
  TransformNodeParent,
  ValidationNodeParent,
  ValidationNodeLeaf,
} from "@ranki/package-api-v2";

const placeholder: ComponentPluginValidationFunc = ({ validation, spec }) => ({
  warnings: [
    ["COMPONENT VALIDATION", validation.kind, spec.blockDepth].join(" "),
  ],
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
        ast: {
          preprocess: (c: string) => c.trim(),
          directives: {
            plugins: {
              // requested: null,
              // requested: [
              // "RankiParamsV2",
              // "RankiRichStructureV2",
              // "RankiRichNumberV2",
              // ],
              // standards: null,
            },
            // content: {
            //   prefix: "% ignore \n",
            // },
          },
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
        validation: placeholder,
        transform: ({ validation }) => {
          if (validation.kind === "leaf") {
            throw new Error(`CODE COMPONENT CANNOT BE A PARENT`);
          }

          const payload = validation.children[0];
          const pauseList = (payload as ValidationNodeParent).children[0];

          const payloadSection = (pauseList as ValidationNodeParent)
            .children[0];
          const payloadPlain = (payloadSection as ValidationNodeParent)
            .children[0];
          const rootIgnore = (payloadPlain as ValidationNodeParent)
            .children[0] as ValidationNodeLeaf;

          // console.log("ignore", JSON.stringify(, null, 2));
          const raw = rootIgnore.source.raw;
          // const raw = payloadPlain.map((v) => (v as ValidationNodeLeaf).source);
          // console.log(raw);

          const ob = {
            tag: "code",
            kind: "leaf" as "leaf",
            print: true,
            creator: validation.type,
            depth: validation.args.depth.total,
            source: {
              type: "mixed" as "mixed",
              // raw: "soon",
              raw,
            },
            // "children":
          };
          return ob;
        },
      },
    },

    // {
    //   chain: "default",
    //   stages: {
    //     ast: {
    //       preprocess: (c: string) => c.trim(),
    //       directives: {
    //         plugins: {
    //           requested: [
    //             // "RankiParamsV2",
    //             // "RankiRichStructureV2",
    //             // "RankiRichNumberV2",
    //           ],
    //         },
    //         content: {
    //           prefix: "",
    //           suffix: "",
    //         },
    //       },
    //       params: {
    //         setting: {
    //           positional: [["path"]],
    //           shorthands: {
    //             b: ["cat", "dog"],
    //           },
    //         },
    //         directive: {
    //           positional: [],
    //           shorthands: {
    //             p: ["content", "prefix"],
    //             r: ["plugins", "requested"],
    //           },
    //         },
    //       },
    //     },
    //     validation: placeholder,
    //   },
    // },
  ],
};
