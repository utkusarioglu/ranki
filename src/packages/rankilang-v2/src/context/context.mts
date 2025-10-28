import type {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangAstContext,
  RankiLangParseHandler,
  ComponentPluginComponent,
  RankiLanguageConfig,
  RankiLangCloneFunctionReturn,
  RankiLanguageProvidedConfig,
  RankiLangParseFunctionReturn,
  AstNode,
  RankiLangContextParams,
  BindingNode,
  RankiLangParseHandlerFunction,
  Enrichments,
} from "@ranki/package-api-v2";

export class RankiLangContext implements RankiLangContextInstance {
  private parserDefinition!: RankiLangParseHandler;
  private parser!: RankiLangParseHandlerFunction;
  private theater: RankiLangContextParams["theater"];
  private role: RankiLangContextParams["role"];
  private blockDepth: NonNullable<RankiLangContextParams["blockDepth"]>;
  private inlineDepth: NonNullable<RankiLangContextParams["inlineDepth"]>;
  private startRule: NonNullable<RankiLangContextParams["startRule"]>;
  private hooks: RankiLangContextParams["hooks"];
  // private context: RankiLangContextParams;

  constructor(p: RankiLangContextParams) {
    this.theater = p.theater;
    this.role = p.role;
    this.blockDepth = p.blockDepth || 0;
    this.inlineDepth = p.inlineDepth || 0;
    this.startRule = p.startRule || "root";
    this.hooks = p.hooks;
  }

  // setParser(p: T): RankiLangContextInstance<T> {
  //   this.parser = p;
  //   return this;
  // }

  enrich<P extends BindingNode, Output extends BindingNode>(
    p: P,
    en?: Enrichments,
  ): Output {
    if (en && en.children) {
      if (!p.children) {
        p.children = [];
      }
      en.children.forEach((i) => (i.parent = p));
      p.children.push(...en.children);
    }

    if (en && en.subtree) {
      if (!p.subtree) {
        p.subtree = {};
      }
      Object.entries(en.subtree).forEach(([k, v]) => {
        v = { parent: p, ...v };
        // @ts-expect-error
        p.subtree[k] = v;
      });
    }

    if (p.shape) {
      p.shape = {
        ...this.getContextArgs(),
        ...p.shape,
      };
    }

    p = {
      plugins: {
        parser: {
          hash: this.getHash("ast"),
          ...this.getParserDefinition(),
        },
        grammars: {},
      },
      ...p,
    };

    return p as unknown as Output;
  }

  setParser(parseHandlerDef: RankiLangParseHandler): RankiLangContextInstance {
    this.parserDefinition = parseHandlerDef;
    this.parser = this.hooks.createParser(parseHandlerDef, this);
    return this as RankiLangContextInstance;
  }

  getParserDefinition(): RankiLangParseHandler {
    if (!this.parserDefinition) {
      throw new Error("PARSER DEFINITION HASN'T BEEN SET");
    }
    return this.parserDefinition;
  }

  getPlugins: () => ParserPluginsInstance = (...all) =>
    this.hooks.getPlugins(...all);

  getHandler: (handlerName: string) => RankiLangParseHandlerFunction = (
    ...all
  ) => this.hooks.getHandler(...all);

  getAllConfig: () => RankiLanguageConfig = (...all) =>
    this.hooks.getConfig(...all);

  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent {
    return this.hooks.getComponent(handlerName, chain);
  }

  cloneLang(
    userConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn {
    return this.hooks.clone(userConfigs);
  }

  parseAst(
    raw: string,
    context: RankiLangAstContext,
  ): RankiLangParseFunctionReturn {
    if (!this.parser) {
      throw new Error("PARSER HASN'T BEEN CREATED");
    }
    return this.parser(raw, context);
  }

  incrementDepth(direction: "block" | "inline"): AstNode["shape"]["depth"] {
    switch (direction) {
      case "block":
        this.blockDepth++;
        break;
      case "inline":
        this.inlineDepth++;
        break;
    }
    return {
      block: this.blockDepth,
      inline: this.inlineDepth,
      total: this.blockDepth + this.inlineDepth,
    };
  }

  getStartRule(): string {
    return this.startRule;
  }

  newChild(direction?: "block" | "inline"): RankiLangContextInstance {
    const inst = new RankiLangContext({
      theater: this.theater,
      role: this.role,
      blockDepth: this.blockDepth,
      inlineDepth: this.inlineDepth,
      startRule: this.startRule,
      hooks: this.hooks,
    }).setParser(this.getParserDefinition());
    if (direction) {
      inst.incrementDepth(direction);
    }
    return inst;
  }

  getDepth(direction: "block" | "inline" | "total"): number {
    switch (direction) {
      case "block":
        return this.blockDepth;
      case "inline":
        return this.inlineDepth;
      case "total":
        return this.blockDepth + this.inlineDepth;
    }
  }

  getContextArgs(): Pick<AstNode["shape"], "depth"> {
    return {
      depth: {
        block: this.blockDepth,
        inline: this.inlineDepth,
        total: this.blockDepth + this.inlineDepth,
      },
    };
  }

  getHash(type: "ast"): string {
    switch (type) {
      case "ast":
        return "I'M CURRENTLY FIXING THIS";
      // return this.context.astHash;
      default:
        throw new Error(`UNDEFINED HASH TYPE: ${type}`);
    }
  }

  getMergedConfig: () => RankiLanguageConfig["merged"] = () =>
    this.hooks.getConfig()["merged"];

  getPluginConfig: (pluginName: string) => any = (pluginName: string) => {
    const merged = this.getMergedConfig().plugins.config;
    // @ts-ignore
    if (!merged[pluginName]) {
      throw new Error(`NO SUCH PLUGIN: ${pluginName}`);
    }
    // @ts-expect-error
    return merged[pluginName] as T;
  };
}
