import type {
  RankiPluginComponent,
  ComponentPluginValidationFunc,
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
            content: {
              prefix: "% ignore \n",
            },
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
        // @ts-expect-error
        transform: ({ validation }) => {
          console.log("c", JSON.stringify(validation, null, 2));
          if (validation.kind === "parent") {
            throw new Error(`CODE COMPONENT CANNOT BE A PARENT`);
          }

          const ob = Object.freeze({
            tag: "FrameV2Code",
            kind: validation.kind,
            print: true,
            creator: validation.type,
            depth: 0,
            // depth: validation.args.depth.total,
            source: {
              type: "lowercase",
              raw: "soon",
            },
            // "children":
          });
          console.log(ob);
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
