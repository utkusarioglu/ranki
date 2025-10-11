export class ComponentPlugins {
  private loaded = {
    code: {
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
            prefix: "CODE_PREFIX",
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
  };

  get(chain: string[]) {
    const pluginName = chain.join(".");
    const found = this.loaded[pluginName];
    if (!found) {
      throw new Error(`NO COMPONENT PLUGIN NAMED ${pluginName}`);
    }
    return found;
  }
}
