import type {
  DqmPluginName,
  DqmPluginVersion,
} from "../config/export.types.mjs";
import type {
  ISerializedNode,
  ISerializedLeaf,
  ISerializedParent,
} from "../nodes/export.types.mjs";
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
  sync: RenderFunction; // for skeletons
  deferred?: () => Promise<RenderFunction>;
}

export interface IDqmRenderPluginRendererSync
  extends IDqmRenderPluginRendererCommon {
  // load: "sync";
  // sync: RenderFunction;
}

export interface IDqmRenderPluginRendererLazy
  extends IDqmRenderPluginRendererCommon {
  // load: "lazy";
}

export interface IDqmRendererClientPreferences {
  scheme: "light" | "dark";
}

export type Assertions = {
  // TODO any
  parent(t: ISerializedNode, extra: any): asserts t is ISerializedParent;
  // TODO any
  leaf(t: ISerializedNode, extra: any): asserts t is ISerializedLeaf;
  // TODO any
  exists(a: any, extra: any): asserts a is object;
};

export type RenderFunction = (
  trn: ISerializedNode,
  pref: IDqmRendererClientPreferences,
  tools: Assertions,
) => RenderNode;

export type RenderNode = {
  element: HTMLElement | DocumentFragment | Text;
  css?: RenderNodeCssSpec[];
  getMount?: () => HTMLElement;
  afterMount?: RenderNodeOnMountCallback[];
  beforeUnmount?: RenderNodeOnUnmountCallback[];
};

export interface RenderNodeCssSpec {
  id: string;
  css: string;
}

export type RenderNodeOnMountCallback = () => Promise<void>;
export type RenderNodeOnUnmountCallback = () => Promise<void>;
