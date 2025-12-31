import type {
  DqmPluginName,
  DqmPluginVersion,
} from "../config/export.types.mjs";
import type { TrnBuilt } from "../nodes/export.types.mjs";
import type { Chain, IDqmPluginExtends } from "../plugins/export.types.mjs";
import type { DqmRenderEngineName } from "./render-engine-plugin.mjs";

export interface IDqmPluginRenderer extends IDqmPluginExtends {
  type: "renderer";
  meta: {
    name: DqmPluginName;
    engine: DqmRenderEngineName;
    description: string;
    version: DqmPluginVersion;
  };
  list: IDqmRenderPluginRenderer[];
}

export type IDqmRenderPluginRenderer =
  | IDqmRenderPluginRendererSync
  | IDqmRenderPluginRendererLazy;

interface IDqmRenderPluginRendererCommon {
  /**
   * This api could be useful if multiple renderers are allowed
   */
  // engine: "dqm-static-renderer";
  chain: Chain;
}

export interface IDqmRenderPluginRendererSync
  extends IDqmRenderPluginRendererCommon {
  load: "sync";
  sync: RenderFunction;
}

export interface IDqmRenderPluginRendererLazy
  extends IDqmRenderPluginRendererCommon {
  load: "lazy";
  sync: RenderFunction; // for skeletons
  deferred: () => Promise<RenderFunction>;
}

export interface IDqmRendererClientPreferences {
  scheme: "light" | "dark";
}

export type RenderFunction = (
  trn: TrnBuilt,
  pref: IDqmRendererClientPreferences,
) => RenderNode;

export type RenderNode = {
  element: HTMLElement | DocumentFragment | Text;
  css?: RankiRenderNodeCssSpec[];
  slots?: Record<string, HTMLElement>;
  afterMount?: RenderNodeOnMountCallback[];
  beforeUnmount?: RenderNodeOnUnmountCallback[];
};

export interface RankiRenderNodeCssSpec {
  id: string;
  css: string;
}

export type RenderNodeOnMountCallback = () => Promise<void>;
export type RenderNodeOnUnmountCallback = () => Promise<void>;
