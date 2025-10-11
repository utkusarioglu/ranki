import type { RankiPluginComponent } from "@ranki/package-api-v2";

export class ComponentPlugins {
  private list = {
    // code: {
    //   ast: {
    //     preprocess: (c: string) => c.trim(),
    //     directives: {
    //       plugins: {
    //         requested: [
    //           // "RankiParamsV2",
    //           // "RankiRichStructureV2",
    //           // "RankiRichNumberV2",
    //         ],
    //       },
    //       content: {
    //         prefix: "CODE_PREFIX",
    //       },
    //     },
    //     params: {
    //       setting: {
    //         positional: [["pa"]],
    //         shorthands: {
    //           b: ["cat", "dog"],
    //         },
    //       },
    //       directive: {
    //         positional: [],
    //         shorthands: {
    //           p: ["content", "prefix"],
    //           r: ["plugins", "requested"],
    //         },
    //       },
    //     },
    //   },
    // },
  };

  addPlugin(plugin: RankiPluginComponent) {
    if (!this.list[plugin.handler]) {
      this.list[plugin.handler] = {};
    }
    plugin.list.forEach((com) => {
      if (this.list[plugin.handler][com.chain]) {
        throw new Error(`COMPONENT PLUGIN ALREADY REGISTERED FOR ${com.chain}`);
      }

      this.list[plugin.handler][com.chain] = com;
    });
  }

  getPlugin(handlerName: string, chain: string[]) {
    console.log("p", this.list);
    const pluginName = chain.join(".");
    const h = this.list[handlerName];
    if (!h) {
      throw new Error(`NO COMPONENT PLUGIN REGISTERED FOR ${handlerName}`);
    }
    const p = h[pluginName];
    if (!p) {
      throw new Error(
        `NO COMPONENT PLUGIN NAMED ${pluginName} FOR ${handlerName}`,
      );
    }
    return p;
  }
}
