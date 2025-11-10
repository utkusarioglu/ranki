import type {
  RankiPluginComponent,
  ComponentPluginComponent,
  ComponentChainString,
  ComponentAlias,
  ComponentHandler,
  ComponentChain,
  ComponentPluginTransformFunc,
  ValidationNode,
} from "@ranki/package-api-v2";

interface ShorthandConflict {
  shorthand: ComponentAlias;
  evicted: { handler: ComponentHandler; chain: ComponentChain };
}

export class ComponentPlugins {
  private components: Record<
    ComponentHandler,
    Record<ComponentChainString, ComponentPluginComponent>
  > = {};
  private shorthandConflicts: ShorthandConflict[] = [];
  private aliases = new Map<ComponentAlias, ComponentChain>();
  private transformers = new Map<string, ComponentPluginTransformFunc>();
  private rootTransformerKeys = new Map<string, string>();

  addPlugin(plugin: RankiPluginComponent) {
    if (!this.components[plugin.handler]) {
      this.components[plugin.handler] = {};
    }
    plugin.list.forEach((component) => {
      const chainStr: ComponentChainString = component.chain.join(".");
      if (component.chain.length < 3) {
        throw new Error(`COMPONENT CHAINS NEED TO BE NAMESPACED: ${chainStr}`);
      }
      if (!!this.components[plugin.handler][chainStr]) {
        throw new Error(`COMPONENT PLUGIN ALREADY REGISTERED FOR ${chainStr}`);
      }

      this.components[plugin.handler][chainStr] = component;

      Object.entries(component.stages.transformers.list).forEach(
        ([creator, transformer]) => {
          const transformerKey = this.createTransformerKey(
            // plugin.handler,
            component.chain.join("."),
            creator,
          );
          if (this.transformers.has(transformerKey)) {
            throw new Error(`TRANSFORMER ${transformerKey} ALREADY REGISTERED`);
          }
          this.transformers.set(transformerKey, transformer);
        },
      );

      this.rootTransformerKeys.set(
        chainStr,
        component.stages.transformers.root,
      );

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

  private createTransformerKey(
    chainString: ComponentChainString,
    creator: string,
  ) {
    return [chainString, creator].join(":");
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
  }

  getTransformer(v: ValidationNode): ComponentPluginTransformFunc {
    const chain = this.retrieveChainStr(v.plugins.transformer.chain);
    const creator = v.creator;
    const key = this.createTransformerKey(chain, creator);
    const transform = this.transformers.get(key);
    if (!transform) {
      throw new Error(`REQUESTED UNREGISTERED TRANSFORM: ${key}`);
    }
    return transform;
  }

  getPlugin(
    handlerName: ComponentHandler,
    requestName: ComponentChain | ComponentAlias[],
  ): ComponentPluginComponent {
    let chainStr = this.retrieveChainStr(requestName);
    const h = this.components[handlerName];
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
