import type {
  RankiPluginComponent,
  ComponentPluginComponent,
  ComponentChainString,
  ComponentAlias,
  ComponentHandler,
  ComponentChain,
} from "@ranki/package-api-v2";

interface ShorthandConflict {
  shorthand: ComponentAlias;
  evicted: { handler: ComponentHandler; chain: ComponentChain };
}

export class ComponentPlugins {
  private list: Record<
    ComponentHandler,
    Record<ComponentChainString, ComponentPluginComponent>
  > = {};
  private aliases: Map<ComponentAlias, ComponentChain> = new Map();
  private shorthandConflicts: ShorthandConflict[] = [];

  addPlugin(plugin: RankiPluginComponent) {
    if (!this.list[plugin.handler]) {
      this.list[plugin.handler] = {};
    }
    plugin.list.forEach((component) => {
      const chainStr: ComponentChainString = component.chain.join(".");
      if (component.chain.length < 3) {
        console.log("l", component.chain, component.chain.length);
        throw new Error(`COMPONENT CHAINS NEED TO BE NAMESPACED: ${chainStr}`);
      }
      if (!!this.list[plugin.handler][chainStr]) {
        throw new Error(`COMPONENT PLUGIN ALREADY REGISTERED FOR ${chainStr}`);
      }

      this.list[plugin.handler][chainStr] = component;

      component.aliases.forEach((alias) => {
        if (alias.includes(".")) {
          throw new Error(`COMPONENT ALIASES CANNOT BE NAMESPACED: ${alias}`);
        }
        const preexisting = this.aliases.get(alias);
        if (preexisting) {
          this.shorthandConflicts.push({
            shorthand: alias,
            evicted: {
              handler: plugin.handler,
              chain: preexisting,
            },
          });
        }
        this.aliases.set(alias, component.chain);
      });
    });
  }

  private retrieveChainStr(
    requestName: ComponentChain | ComponentAlias[],
  ): ComponentChainString {
    const chainOrAlias = requestName.join(".");
    if (chainOrAlias.includes(".")) {
      return chainOrAlias;
    } else {
      const chain = this.aliases.get(chainOrAlias);
      if (!chain) {
        throw new Error(`NO COMPONENT WITH ALIAS ${chainOrAlias}`);
      }
      return chain.join(".");
    }

    // let chain: ComponentChain | undefined;
    // if (!requestName.includes(".")) {
    // } else {
    //   chain = requestName as ComponentChain;
    // }
    // return chain.join(".");
  }

  getPlugin(
    handlerName: ComponentHandler,
    requestName: ComponentChain | ComponentAlias[],
  ): ComponentPluginComponent {
    let chainStr = this.retrieveChainStr(requestName);
    const h = this.list[handlerName];
    if (!h) {
      throw new Error(`NO COMPONENT PLUGIN REGISTERED FOR ${handlerName}`);
    }
    const p = h[chainStr];
    if (!p) {
      throw new Error(
        `NO COMPONENT PLUGIN NAMED ${chainStr} FOR ${handlerName}`,
      );
    }
    return p;
  }
}
