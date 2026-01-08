import type { IDqmPluginRenderEngine } from "@dqm/package-dqm-api-v2";
import { DqmStaticRenderer } from "./engine.mjs";

export const staticRenderer: IDqmPluginRenderEngine = {
  type: "render-engine",
  meta: {
    name: "DqmStaticRenderer",
    description:
      "Stateless rendering engine for fire-and-forget environments such as blog posts and Anki.",
    version: "0.0.0",
  },
  engine: DqmStaticRenderer,
};
