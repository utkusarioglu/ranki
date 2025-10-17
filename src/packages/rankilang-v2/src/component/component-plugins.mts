import type {
  RankiPluginComponent,
  ComponentPluginComponent,
} from "@ranki/package-api-v2";

export class ComponentPlugins {
  private list: Record<string, Record<string, ComponentPluginComponent>> = {};

  addPlugin(plugin: RankiPluginComponent) {
    if (!this.list[plugin.handler]) {
      this.list[plugin.handler] = {};
    }
    plugin.list.forEach((com) => {
      if (!!this.list[plugin.handler][com.chain]) {
        throw new Error(`COMPONENT PLUGIN ALREADY REGISTERED FOR ${com.chain}`);
      }

      this.list[plugin.handler][com.chain] = com;
    });
  }

  getPlugin(handlerName: string, chain: string[]): ComponentPluginComponent {
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
