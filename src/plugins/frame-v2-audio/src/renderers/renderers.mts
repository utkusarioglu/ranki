import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { tones } from "./tones/tones.mjs";

export const renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Audio",
    engine: "DqmStaticRenderer",
    description: "Audio renderers",
    version: "0.0.0",
  },
  list: [...tones],
};
