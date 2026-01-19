import type {
  DqmPluginName,
  DqmPluginVersion,
} from "../config/export.types.mjs";
import type {
  ISerializedLeaf,
  ISerializedNode,
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
  | IDqmRenderPluginRendererParent
  | IDqmRenderPluginRendererLeaf;

interface IDqmRenderPluginRendererCommon {
  /**
   * This api could be useful if multiple renderers are allowed
   */
  chain: Chain;
}

export interface IDqmRenderPluginRendererParent extends IDqmRenderPluginRendererCommon {
  kind: "parent";
  sync: RenderFunction<ISerializedParent>; // for skeletons or sync renderers
  deferred?: () => Promise<RenderFunction<ISerializedParent>>;
}

export interface IDqmRenderPluginRendererLeaf extends IDqmRenderPluginRendererCommon {
  kind: "leaf";
  sync: RenderFunction<ISerializedLeaf>; // for skeletons or sync renderers
  deferred?: () => Promise<RenderFunction<ISerializedLeaf>>;
}

export interface IDqmRendererClientPreferences {
  scheme: "light" | "dark";
  // payload: any;
}
// export type AssertionName = "parent" | "leaf";

export type Assertions = {
  // TODO any
  parent(t: ISerializedNode, extra: any): asserts t is ISerializedParent;
  // TODO any
  leaf(t: ISerializedNode, extra: any): asserts t is ISerializedLeaf;
  // TODO any
  exists(a: any, extra: any): asserts a is object;
  never(extra: any): never;
};

export interface RenderFunctionParams<T> {
  ser: T;
  pref: IDqmRendererClientPreferences;
}

export type RenderFunction<T> = (p: RenderFunctionParams<T>) => RenderNode;

export type RenderNodeElementTypes = HTMLElement | DocumentFragment | Text;

export type RenderNode<GElement = RenderNodeElementTypes> = {
  element: GElement;
  css?: RenderNodeCssSpec[];
  getMount?: () => HTMLElement;
  // DECIDE this is relevant for external ui tools but it has no use for render units
  subtree?: Record<string, () => HTMLElement>;
  afterMount?: RenderNodeOnMountCallback[];
  beforeUnmount?: RenderNodeOnUnmountCallback[];
};

export interface RenderNodeCssSpec {
  id: string;
  css: string;
}

export type RenderNodeOnMountCallback = () => Promise<void>;
export type RenderNodeOnUnmountCallback = () => Promise<void>;
