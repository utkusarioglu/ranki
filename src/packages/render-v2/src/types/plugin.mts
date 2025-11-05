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
) => RankiRenderPluginItemRenderFunctionReturn;

export type RankiRenderPluginItemRenderFunctionReturn = {
  element: HTMLElement;
  css?: string;
  slots?: {
    children: HTMLElement;
  };
  onLoad: () => void;
};
