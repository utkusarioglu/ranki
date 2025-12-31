import type { DqmTransformOutput } from "../dqm.types.mjs";
import type {
  IDqmPluginRenderer,
  IDqmRendererClientPreferences,
} from "./render-plugin.types.mjs";

export interface RenderReport {}

export type RenderRoots = Record<string, HTMLDivElement>;

export interface IDqmRenderEngine {
  render(
    trn: DqmTransformOutput,
    roots: RenderRoots,
    pref: IDqmRendererClientPreferences,
  ): RenderReport;

  addPlugin(plugin: IDqmPluginRenderer): void;
}

export type IDqmRenderEngineConstructor = new () => IDqmRenderEngine;
