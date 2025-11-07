import type { RankiPluginCommon, TransformNode } from "@ranki/package-api-v2";

export interface RankiPluginRenderer extends RankiPluginCommon {
  type: "renderer";
  items: RankiRenderPluginItem[];
}

export type RankiRenderPluginItem =
  | RankiRenderPluginItemLazy
  | RankiRenderPluginItemStatic;

interface RankiRenderPluginItemCommon {
  tag: string;
  engine: string;
}

interface RankiRenderPluginItemLazy extends RankiRenderPluginItemCommon {
  load: "lazy";
  renderer: () => Promise<RankiRenderPluginItemRenderFunction>;
}

interface RankiRenderPluginItemStatic extends RankiRenderPluginItemCommon {
  load: "static";
  renderer: RankiRenderPluginItemRenderFunction;
}

export type RankiRenderPluginItemRenderFunction = (
  n: TransformNode,
) => Promise<RankiRenderNode>;

export interface RankiRenderNodeCssSpec {
  id: string;
  css: string;
}

export type RankiRenderNodeOnLoadCallback = () => Promise<void>;

export type RankiRenderNode = {
  element: HTMLElement;
  css?: RankiRenderNodeCssSpec[];
  slots?: {
    children: HTMLElement;
  };
  onLoad?: RankiRenderNodeOnLoadCallback[];
};
