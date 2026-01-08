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
  ): RenderReport;

  addPlugin(plugin: IDqmPluginRenderer): void;
}

export type IDqmRenderEngineConstructor = new (
  assertions: Assertions,
) => IDqmRenderEngine;
