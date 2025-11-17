import type { RankiPluginCommon, TransformNode } from "@ranki/package-api-v2";
import type { RenderClientOptions } from "./render.type.mjs";

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
  options: RenderClientOptions,
) => Promise<RankiRenderNode>;

export interface RankiRenderNodeCssSpec {
  id: string;
  css: string;
}

export type RankiRenderNodeOnLoadCallback = () => Promise<void>;

export type RankiRenderHelper = {
  element: HTMLElement | DocumentFragment | Text;
  css: RankiRenderNodeCssSpec[];
  slots: {
    children?: HTMLElement;
  };
  subtree: Record<string, () => HTMLElement>;
  afterMount: RankiRenderNodeOnLoadCallback[];
  beforeUnmount: RankiRenderNodeOnLoadCallback[];
};

export type RankiRenderNode = {
  element: HTMLElement | DocumentFragment | Text;
  css?: RankiRenderNodeCssSpec[];
  slots?: Record<string, HTMLElement>;
  // subtree?: Record<string, () => HTMLElement>;
  // slots?: {
  //   children: HTMLElement;
  // };
  afterMount?: RankiRenderNodeOnLoadCallback[];
  beforeUnmount?: RankiRenderNodeOnLoadCallback[];
};
