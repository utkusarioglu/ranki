import {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangAstContext,
  RankiLangParseHandlerCommon,
  ComponentPluginComponent,
  RankiLanguageConfig,
  RankiLangCloneFunctionReturn,
  RankiLanguageProvidedConfig,
  RankiLangParseFunctionReturn,
  AstNode,
  RankiLangContextParams,
  BindingNode,
} from "@ranki/package-api-v2";
import { RankiLangParseHandlerFunction } from "../../api-v2/src/plugins/parser.mjs";
import { Enrichments } from "../../api-v2/src/lang/context.mjs";

export class RankiLangContext<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> implements RankiLangContextInstance<T>
{
  // private parent: AstNode = null;
  // private node: AstNode = null;
  private context: RankiLangContextParams<T>;

  // private startRule: string;

  constructor(oldContext: RankiLangContextParams<T>) {
    this.context = oldContext;
  }

  // setParentAstNode(parent: any) {
  //   // if (this.node.creator === "root_structure") {
  //   // }
  //   // if (!parent) {
  //   //   throw new Error("PARENT IS NULL / UNDEFINED");
  //   // }
  //   this.parent = parent;
  // }

  setParser(parser: T) {
    this.context.parser = parser;
    return this;
  }

  // getParentAstNode(): AstNode {
  //   return this.parent;
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
      parser: { hash: this.getHash("ast") },
      ...p,
    };

    return p as unknown as Output;
  }
  // bindChildren(p, c): AstNode {
  //   this.node = n;
  //   return this.node;
  // }

  getParser(): T {
    return this.context.parser;
  }

  getPlugins: () => ParserPluginsInstance = (...all) =>
    this.context.hooks.getPlugins(...all);

  getHandler: (handlerName: string) => RankiLangParseHandlerFunction = (
    ...all
  ) => this.context.hooks.getHandler(...all);

  getAllConfig: () => RankiLanguageConfig = (...all) =>
    this.context.hooks.getConfig(...all);

  getComponent(handlerName: string, chain: string[]): ComponentPluginComponent {
    return this.context.hooks.getComponent(handlerName, chain);
  }

  cloneLang(
    userConfigs: RankiLanguageProvidedConfig[] | null,
  ): RankiLangCloneFunctionReturn {
    return this.context.hooks.clone(userConfigs);
  }

  parseAst: <
    T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
  >(
    raw: string,
    context: RankiLangAstContext<T>,
  ) => RankiLangParseFunctionReturn = (...all) =>
    this.context.hooks.parseAst(...all);

  incrementDepth(direction: "block" | "inline"): AstNode["shape"]["depth"] {
    switch (direction) {
      case "block":
        this.context.blockDepth++;
        break;
      case "inline":
        this.context.inlineDepth++;
        break;
    }
    return {
      block: this.context.blockDepth,
      inline: this.context.inlineDepth,
      total: this.context.blockDepth + this.context.inlineDepth,
    };
  }

  getStartRule(): string {
    return this.context.startRule;
  }

  newChild(direction?: "block" | "inline"): RankiLangContextInstance<T> {
    const newContext = { ...this.context };

    // if (this.node === null) {
    //   throw new Error("THIS NODE IS NOT REGISTERED");
    // }

    const inst = new RankiLangContext(newContext);
    // inst.setParentAstNode(this.node);
    if (direction) {
      inst.incrementDepth(direction);
    }
    return inst;
  }

  getDepth(direction: "block" | "inline" | "total"): number {
    switch (direction) {
      case "block":
        return this.context.blockDepth;
      case "inline":
        return this.context.inlineDepth;
      case "total":
        return this.context.blockDepth + this.context.inlineDepth;
    }
  }

  getContextArgs(): Pick<AstNode["shape"], "depth"> {
    return {
      depth: {
        block: this.context.blockDepth,
        inline: this.context.inlineDepth,
        total: this.context.blockDepth + this.context.inlineDepth,
      },
    };
  }

  getHash(type: "ast"): string {
    return this.context.astHash;
  }

  getMergedConfig: () => RankiLanguageConfig["merged"] = () =>
    this.context.hooks.getConfig()["merged"];

  // @ts-expect-error type not precise enough
  getPluginConfig: <T extends Record<string, any>>(pluginName: string) => T = (
    pluginName: string,
  ) => {
    const merged = this.getMergedConfig().plugins.config;
    if (!merged[pluginName]) {
      throw new Error(`NO SUCH PLUGIN: ${pluginName}`);
    }
    return merged[pluginName] as T;
  };
}
