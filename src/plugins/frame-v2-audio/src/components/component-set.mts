import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { tones } from "./tones/tones.mjs";

export const frameV2Tones: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Audio",
    version: "0.0.0",
    description: "Audio components",
  },
  list: [tones],
};
