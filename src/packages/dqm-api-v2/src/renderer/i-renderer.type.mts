import type { DqmSerializeOutput } from "../dqm.types.mjs";
import type {
  IDqmPluginRenderer,
  IDqmRendererClientPreferences,
  Assertions,
} from "./render-plugin.types.mjs";

export interface RenderReport {}

export type RenderRoots = Record<string, HTMLDivElement>;

export interface IDqmRenderEngine {
  render(
    trn: DqmSerializeOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
    tools: Assertions,
  ): RenderReport;

  addPlugin(plugin: IDqmPluginRenderer): void;
}

export type IDqmRenderEngineConstructor = new () => IDqmRenderEngine;
