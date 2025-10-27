import type { RankiPluginComponent, ComponentPluginComponent } from "@ranki/package-api-v2";
export declare class ComponentPlugins {
    private list;
    addPlugin(plugin: RankiPluginComponent): void;
    getPlugin(handlerName: string, chain: string[]): ComponentPluginComponent;
}
