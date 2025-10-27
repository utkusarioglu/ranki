import type { RankiLanguageConfig, RankiLangInstance, RankiLangParseResult, RankiLangParseSpecs, RankiLanguageProvidedConfig, ParserPluginsInstance, ComponentPluginsInstance, RankiLangInstancePluginsRecord } from "@ranki/package-api-v2";
export declare class RankiLang implements RankiLangInstance {
    private config;
    components: ComponentPluginsInstance;
    parsers: ParserPluginsInstance;
    private validators;
    private transformers;
    private ast;
    constructor(plugins: RankiLangInstancePluginsRecord, provided: RankiLanguageProvidedConfig[]);
    getConfig(): RankiLanguageConfig;
    getPlugins(): ParserPluginsInstance;
    private clone;
    private createParseHandlerHooks;
    parse(raw: Record<string, string>, spec?: RankiLangParseSpecs): RankiLangParseResult;
}
export interface ParseContext {
    config: RankiLanguageConfig;
    lang: RankiLang;
}
