import type { RankiPluginParser, VersionReport, RankiLangParseHandlerFunction, ParserPluginsInstance, ProducedConfig, ActionsDictRecord } from "@ranki/package-api-v2";
export declare class ParserPlugins implements ParserPluginsInstance {
    private list;
    private handler;
    getHandler(handlerName: string): RankiLangParseHandlerFunction;
    addPlugin(plugin: RankiPluginParser): void;
    getList(): RankiPluginParser[];
    find(name: string): RankiPluginParser;
    count(): number;
    namesSet(): Set<string>;
    getVersions(): VersionReport;
    pickPlugins(set: Set<string>): RankiPluginParser[];
    checkMissing(set: Set<string>): string[];
    sortPlugins(activePluginsArr: RankiPluginParser[]): string[];
    dependencyGraph(activePluginsArr: RankiPluginParser[]): Record<RankiPluginParser["meta"]["name"], RankiPluginParser["meta"]["name"][]>;
    getActions(): ActionsDictRecord;
    produceConfig(): ProducedConfig;
}
