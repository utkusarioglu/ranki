import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { codeBlock } from "./code-block/code-block.mjs";

export const renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Code",
    engine: "DqmStaticRenderer",
    description: "Block and inline code",
    version: "0.0.0",
  },
  list: [...codeBlock],
};
