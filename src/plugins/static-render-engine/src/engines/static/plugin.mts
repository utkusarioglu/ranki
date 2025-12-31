import type { IDqmPluginRenderEngine } from "@dqm/package-dqm-api-v2";
import { DqmStaticRenderer } from "./engine.mjs";

export const staticRenderer: IDqmPluginRenderEngine = {
  type: "render-engine",
  meta: {
    name: "DqmStaticRenderer",
    description: "A simple, stateless rendering engine",
    version: "0.0.0",
  },
  engine: DqmStaticRenderer,
};
