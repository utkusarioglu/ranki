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
              requested: [
                // "RankiParamsV2",
                // "RankiRichStructureV2",
                // "RankiRichNumberV2",
              ],
            },
            content: {
              prefix: "CODE_PREFIXA!",
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
      },
    },

    {
      chain: "default",
      stages: {
        ast: {
          preprocess: (c: string) => c.trim(),
          directives: {
            plugins: {
              requested: [
                // "RankiParamsV2",
                // "RankiRichStructureV2",
                // "RankiRichNumberV2",
              ],
            },
            content: {
              prefix: "",
              suffix: "",
            },
          },
          params: {
            setting: {
              positional: [["path"]],
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
      },
    },
  ],
};
