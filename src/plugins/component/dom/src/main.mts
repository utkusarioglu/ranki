import type { RankiPluginComponent } from "@ranki/package-api-v2";

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
              positional: [["pa"]],
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
      },
    },

    {
      chain: "pre",
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
              prefix: "PREPRE-",
              suffix: "-PREPRE",
            },
          },
          params: {
            setting: {
              positional: [["pa"]],
              shorthands: {
                b: ["cat", "dog"],
              },
            },
            directive: {
              positional: [],
              shorthands: {
                // p: ["content", "prefix"],
                r: ["plugins", "requested"],
              },
            },
          },
        },
      },
    },
  ],
};
