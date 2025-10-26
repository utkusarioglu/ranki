import {
  ParserPluginsInstance,
  RankiLangContextInstance,
  RankiLangAstContext,
  RankiLangParseHandlerCommon,
  RankiLangParseHandlerHooks,
  RankiLangInstance,
  ComponentPluginComponent,
  RankiLanguageConfig,
  RankiLangCloneFunctionReturn,
  RankiLanguageProvidedConfig,
  RankiLangParseFunctionReturn,
  AstNode,
  RankiLangContextParams,
} from "@ranki/package-api-v2";
import { RankiLangParseHandlerFunction } from "../../api-v2/src/plugins/parser.mjs";

export class RankiLangContext<
  T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon,
> implements RankiLangContextInstance<T>
{
  private parent: AstNode;
  private node: AstNode = null;
  private context: RankiLangContextParams<T>;

  // private startRule: string;

  constructor(oldContext: RankiLangContextParams<T>, parent: AstNode | null) {
    this.context = oldContext;
    this.parent = parent;
    console.log(this.parent);
    // this.startRule = startRule;
  }

  setParser(parser: T) {
    this.context.parser = parser;
    return this;
  }

  getParentAstNode(): AstNode {
    return this.parent;
  }

  registerAstNode(n: AstNode): AstNode {
    this.node = n;
    return n;
  }

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

  incrementDepth(direction: "block" | "inline"): AstNode["args"]["depth"] {
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
    const inst = new RankiLangContext(newContext, this.node);
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

  getContextArgs(): Pick<AstNode["args"], "depth"> {
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
