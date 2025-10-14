import type {
  RankiRenderPluginItem,
  RankiRenderPluginItemRenderFunction,
} from "./plugin.mjs";

export interface RenderLibraryEntry {
  item: RankiRenderPluginItem;
  source: string;
}

export type LoadedRenderCallback = RankiRenderPluginItemRenderFunction;
