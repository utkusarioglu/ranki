import type * as ohm from "ohm-js";
import type {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangParseDefinition,
  ComponentPluginComponent,
  RankiLanguageConfig,
  AstNode,
  RankiLangContextParams,
  BindingNode,
  // RankiLangParseHandlerFunction,
  Enrichments,
  ComponentPluginsInstance,
  RankiLangParseHandlerFunctionReturn,
  RankiLanguageProvidedConfig,
} from "@ranki/package-api-v2";
import { RankiLangParserBoundary } from "./parser-boundary.mjs";
import { AstLibrary } from "../stages/ast/library.mjs";
import { RankiLangConfig } from "../config.mjs";

interface RankiLangContextHooks {
  ast: AstLibrary;
  components: ComponentPluginsInstance;
  parsers: ParserPluginsInstance;
  config: RankiLangConfig;
}

export class RankiLangContext implements RankiLangContextInstance {
  private parserBoundary!: RankiLangParserBoundary;
  private expandedParserDefinition!: RankiLangParseDefinition;
  private provided: RankiLanguageProvidedConfig[] = [];
  private hooks: RankiLangContextHooks;

  private theater: RankiLangContextParams["theater"];
  private role: RankiLangContextParams["role"];

  private blockDepth: NonNullable<RankiLangContextParams["blockDepth"]>;
  private inlineDepth: NonNullable<RankiLangContextParams["inlineDepth"]>;
  private startRule: NonNullable<RankiLangContextParams["startRule"]>;
  private ohmNode: ohm.Node | null = null;

  constructor(
    p: RankiLangContextParams,
    hooks: RankiLangContextHooks,
    transfers?: {
      parserBoundary: RankiLangParserBoundary;
      expandedDefinition: RankiLangParseDefinition;
      provided: RankiLanguageProvidedConfig[];
    },
  ) {
    this.theater = p.theater;
    this.role = p.role;
    this.blockDepth = p.blockDepth || 0;
    this.inlineDepth = p.inlineDepth || 0;
    this.startRule = p.startRule || "root";
    this.hooks = hooks;

    if (transfers) {
      this.parserBoundary = transfers.parserBoundary;
      this.expandedParserDefinition = transfers.expandedDefinition;
    }
  }

  setOhmNode(ohmNode: ohm.Node) {
    this.ohmNode = ohmNode;
  }

  newAstNode<P extends BindingNode, Output extends BindingNode>(
    p: P,
    en?: Enrichments,
  ): Output {
    if (!this.ohmNode) {
      throw new Error("AST NODE CREATION BEFORE OHM NODE REF ASSIGNMENT");
    }

    p.creator = this.ohmNode.ctorName;

    // const currentParser = this.getParserDefinition();
    // const lineage = this.parserBoundary.getLineageHash();
    // const props = this.getParserDefinition();

    p = {
      plugins: {
        parser: {
          current: this.expandedParserDefinition,
          // lineage,
          // current: currentParser,
          // props,
        },
        grammars: {},
      },
      ...p,
    };

    if (p.shape) {
      p.shape = {
        ...this.getContextArgs(),
        ...p.shape,
      };
    }

    if (!p.source) {
      p.source = {
        type: (en && en.sourceType) || "raw",
        raw: this.ohmNode.sourceString,
      };
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

    if (en && en.children) {
      if (!p.children) {
        p.children = [];
      }
      en.children.forEach((i) => (i.parent = p));
      p.children.push(...en.children);
    }

    return p as unknown as Output;
  }

  newBoundary(def: RankiLangParseDefinition): RankiLangContextInstance {
    this.expandedParserDefinition = def;
    return this;
  }

  replaceProvidedConfig(
    provided: RankiLanguageProvidedConfig[] | RankiLanguageProvidedConfig,
  ): RankiLangContextInstance {
    if (Array.isArray(provided)) {
      this.provided = provided;
    } else {
      this.provided = [provided];
    }
    return this;
  }

  addProvidedConfig(
    provided: RankiLanguageProvidedConfig[] | RankiLanguageProvidedConfig,
  ): RankiLangContextInstance {
    if (Array.isArray(provided)) {
      this.provided.push(...provided);
    } else {
      this.provided.push(provided);
    }
    return this;
  }

  getParserDefinition(): RankiLangParseDefinition {
    return this.parserBoundary.getExpandedDefinition();
  }

  getPlugins: () => ParserPluginsInstance = () => this.hooks.parsers;

  getAllConfig: () => RankiLanguageConfig = (...all) =>
    this.parserBoundary.getConfig().getAll(...all);

  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent {
    return this.hooks.components.getPlugin(handlerName, chain);
  }

  parseAst(raw: string): RankiLangParseHandlerFunctionReturn {
    const parentParser = this.parserBoundary;
    if (this.expandedParserDefinition === null) {
      throw new Error("METHOD CALLED BEFORE SETTING THE PARSER");
    }
    this.parserBoundary = new RankiLangParserBoundary(
      this.expandedParserDefinition,
      this.provided,
      {
        ast: this.hooks.ast,
        components: this.hooks.components,
        parsers: this.hooks.parsers,
        config: this.hooks.config,
        context: this,
        parent: parentParser,
      },
    );
    return this.parserBoundary.parse(raw, this);
  }

  getStartRule(): string {
    return this.startRule;
  }

  newChild(
    ohmNode: ohm.Node,
    direction?: "block" | "inline",
  ): RankiLangContextInstance {
    const blockDepth = this.blockDepth + (direction === "block" ? 1 : 0);
    const inlineDepth = this.inlineDepth + (direction === "inline" ? 1 : 0);

    const inst = new RankiLangContext(
      {
        theater: this.theater,
        role: this.role,
        blockDepth,
        inlineDepth,
        startRule: this.startRule,
      },
      this.hooks,
      {
        expandedDefinition: this.expandedParserDefinition,
        parserBoundary: this.parserBoundary,
        provided: this.provided,
      },
    );
    inst.setOhmNode(ohmNode);
    return inst;
  }

  getMergedConfig: () => RankiLanguageConfig["merged"] = () =>
    this.parserBoundary.getConfig().getMerged();

  getPluginConfig: (pluginName: string) => any = (pluginName: string) => {
    return this.parserBoundary.getConfig().getPluginConfig(pluginName);
  };

  private getContextArgs(): Pick<AstNode["shape"], "depth"> {
    return {
      depth: {
        block: this.blockDepth,
        inline: this.inlineDepth,
        total: this.blockDepth + this.inlineDepth,
      },
    };
  }

  // private incrementDepth(
  //   direction: "block" | "inline",
  // ): AstNode["shape"]["depth"] {
  //   switch (direction) {
  //     case "block":
  //       this.blockDepth++;
  //       break;
  //     case "inline":
  //       this.inlineDepth++;
  //       break;
  //   }
  //   return {
  //     block: this.blockDepth,
  //     inline: this.inlineDepth,
  //     total: this.blockDepth + this.inlineDepth,
  //   };
  // }
}
