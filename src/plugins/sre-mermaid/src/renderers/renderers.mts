import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { mermaidBlock } from "./mermaid/mermaid.mjs";

export const renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Mermaid",
    engine: "DqmStaticRenderer",
    description: "Mermaid powered charts and graphs",
    version: "0.0.0",
  },
  list: [...mermaidBlock],
};
