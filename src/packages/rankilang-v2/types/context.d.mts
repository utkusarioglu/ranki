import type { ParserPluginsInstance, RankiLangContextInstance, RankiLangAstContext, RankiLangParseHandlerCommon, ComponentPluginComponent, RankiLanguageConfig, RankiLangCloneFunctionReturn, RankiLanguageProvidedConfig, RankiLangParseFunctionReturn, AstNode, RankiLangContextParams, BindingNode, RankiLangParseHandlerFunction, Enrichments } from "@ranki/package-api-v2";
export declare class RankiLangContext<T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon> implements RankiLangContextInstance<T> {
    private context;
    constructor(oldContext: RankiLangContextParams<T>);
    setParser(parser: T): this;
    enrich<P extends BindingNode, Output extends BindingNode>(p: P, en?: Enrichments): Output;
    getParser(): T;
    getPlugins: () => ParserPluginsInstance;
    getHandler: (handlerName: string) => RankiLangParseHandlerFunction;
    getAllConfig: () => RankiLanguageConfig;
    getComponent(handlerName: string, chain: string[]): ComponentPluginComponent;
    cloneLang(userConfigs: RankiLanguageProvidedConfig[] | null): RankiLangCloneFunctionReturn;
    parseAst: <T extends RankiLangParseHandlerCommon = RankiLangParseHandlerCommon>(raw: string, context: RankiLangAstContext<T>) => RankiLangParseFunctionReturn;
    incrementDepth(direction: "block" | "inline"): AstNode["shape"]["depth"];
    getStartRule(): string;
    newChild(direction?: "block" | "inline"): RankiLangContextInstance<T>;
    getDepth(direction: "block" | "inline" | "total"): number;
    getContextArgs(): Pick<AstNode["shape"], "depth">;
    getHash(type: "ast"): string;
    getMergedConfig: () => RankiLanguageConfig["merged"];
    getPluginConfig: <T extends Record<string, any>>(pluginName: string) => T;
}
