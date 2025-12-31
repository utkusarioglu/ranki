import type {
  DqmPluginName,
  DqmPluginVersion,
  IDqmPluginExtends,
} from "../export.types.mjs";
import type { IDqmRenderEngineConstructor } from "./i-renderer.type.mjs";

export type DqmRenderEngineName = DqmPluginName & {
  subType?: "DqmRenderEngine";
};

export interface IDqmPluginRenderEngine extends IDqmPluginExtends {
  type: "render-engine";
  meta: {
    name: DqmRenderEngineName;
    description: string;
    version: DqmPluginVersion;
  };
  engine: IDqmRenderEngineConstructor;
}
