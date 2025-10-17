import type { RankiPluginRenderer } from "./types/plugin.mjs";
import type { LoadedRenderCallback } from "./types/library.mjs";
export declare class RenderLibrary {
    private plugins;
    private static;
    private loaded;
    addPlugin(plugin: RankiPluginRenderer): void;
    private addStatics;
    getRenderer(tag: string): Promise<LoadedRenderCallback>;
}
