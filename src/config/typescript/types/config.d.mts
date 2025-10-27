import type { RankiLanguageConfig, RankiLanguageProvidedConfig, ProducedConfig } from "@ranki/package-api-v2";
export declare class RankiLangConfig {
    private defaultConfig;
    private providedConfigs;
    private config;
    constructor(pluginConfig: ProducedConfig, userConfigs: RankiLanguageProvidedConfig[]);
    getAll(): RankiLanguageConfig;
    clone(providedConfigs: RankiLanguageProvidedConfig[] | null): RankiLanguageProvidedConfig[];
    private static merge;
}
