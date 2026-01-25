import type { DqmSerializeOutput } from "../dqm.types.mjs";
import type {
  IDqmPluginRenderer,
  IDqmRendererClientPreferences,
  Assertions,
} from "./render-plugin.types.mjs";

// TODO
export interface RenderReport {
  finished: true;
}

export type RenderRoots = { theaters: Record<string, () => HTMLDivElement> };

export interface IDqmRenderEngine {
  render(
    trn: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): Promise<RenderReport>;

  addPlugin(plugin: IDqmPluginRenderer): void;
}

export type IDqmRenderEngineConstructor = new (
  assertions: Assertions,
) => IDqmRenderEngine;
