import { TransformNode } from "@ranki/package-api-v2";
import { RankiPluginRenderer } from "./types/plugin.mjs";
import { RenderLibrary } from "./library.mjs";
import { RenderFunctionReturn } from "./types/render.mjs";
export declare class Render {
    static library: RenderLibrary;
    static addPlugin(plugin: RankiPluginRenderer): void;
    static render(n: TransformNode): Promise<RenderFunctionReturn>;
}
