import type {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangParseDefinition,
  ComponentPluginComponent,
  RankiLanguageConfig,
  RankiLangCloneFunctionReturn,
  RankiLanguageProvidedConfig,
  AstNode,
  RankiLangContextParams,
  BindingNode,
  RankiLangParseHandlerFunction,
  Enrichments,
  CreateParserReturn,
  RankiLangParseHandlerFunctionReturn,
} from "@ranki/package-api-v2";

export class RankiLangContext implements RankiLangContextInstance {
  private parserDefinition!: RankiLangParseDefinition;
  private parserLineage: CreateParserReturn[] = [];
  private parserDefaultDef!: RankiLangParseDefinition;
  private parserProps!: any;

  private theater: RankiLangContextParams["theater"];
  private role: RankiLangContextParams["role"];
  private blockDepth: NonNullable<RankiLangContextParams["blockDepth"]>;
  private inlineDepth: NonNullable<RankiLangContextParams["inlineDepth"]>;
  private startRule: NonNullable<RankiLangContextParams["startRule"]>;
  private hooks: RankiLangContextParams["hooks"];

  constructor(
    p: RankiLangContextParams,
    transfers?: {
      parserLineage: CreateParserReturn[];
      parserDefinition: RankiLangParseDefinition;
      parserDefaultDef: RankiLangParseDefinition;
    },
  ) {
    this.theater = p.theater;
    this.role = p.role;
    this.blockDepth = p.blockDepth || 0;
    this.inlineDepth = p.inlineDepth || 0;
    this.startRule = p.startRule || "root";
    this.hooks = p.hooks;

    if (transfers) {
      this.parserLineage = [...transfers.parserLineage];
      this.parserDefinition = transfers.parserDefinition;
      this.parserDefaultDef = transfers.parserDefaultDef;
    }
  }

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

    // const lastParser = this.parserLineage.at(-1);
    const currentParser = this.getParserDefinition();
    if (!currentParser) {
      throw new Error("NO PARSER HAS BEEN SET");
    }

    const lineage = this.parserLineage.map((p) => p.expandedDefinition.hash);

    p = {
      plugins: {
        parser: {
          lineage,
          current: currentParser,
          props: this.parserProps,
        },
        grammars: {},
      },
      ...p,
    };

    return p as unknown as Output;
  }

  switchParser(
    parserDefinition: RankiLangParseDefinition,
  ): RankiLangContextInstance {
    this.parserDefinition = parserDefinition;
    const createdParser = this.hooks.createParser(parserDefinition, this);
    this.parserLineage.push(createdParser);

    return this;
  }

  getParserDefinition(): RankiLangParseDefinition {
    if (!this.parserDefinition) {
      throw new Error("NO PARSER DEFINITION HAS BEEN SET");
    }
    return this.parserDefinition;
  }

  getPlugins: () => ParserPluginsInstance = (...all) =>
    this.hooks.getPlugins(...all);

  getHandler: (def: RankiLangParseDefinition) => RankiLangParseHandlerFunction =
    (...all) => this.hooks.getHandler(...all);

  getAllConfig: () => RankiLanguageConfig = (...all) =>
    this.hooks.getConfig(...all);

  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent {
    return this.hooks.getComponent(handlerName, chain);
  }

  cloneLang(
    userConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn {
    return this.hooks.cloneLang(userConfigs);
  }

  parseAst(raw: string): RankiLangParseHandlerFunctionReturn {
    const def = this.getParserDefinition();
    const parsed = this.hooks.parseAst(raw, def, this);
    this.parserProps = parsed.props;
    return parsed;
  }

  private incrementDepth(
    direction: "block" | "inline",
  ): AstNode["shape"]["depth"] {
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
    const inst = new RankiLangContext(
      {
        theater: this.theater,
        role: this.role,
        blockDepth: this.blockDepth,
        inlineDepth: this.inlineDepth,
        startRule: this.startRule,
        hooks: this.hooks,
      },
      {
        parserDefinition: this.parserDefinition,
        parserLineage: this.parserLineage,
        parserDefaultDef: this.parserDefaultDef,
      },
    );
    if (direction) {
      inst.incrementDepth(direction);
    }
    return inst;
  }

  private getContextArgs(): Pick<AstNode["shape"], "depth"> {
    return {
      depth: {
        block: this.blockDepth,
        inline: this.inlineDepth,
        total: this.blockDepth + this.inlineDepth,
      },
    };
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
