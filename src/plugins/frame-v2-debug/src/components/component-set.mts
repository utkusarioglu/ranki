import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { debugComponent } from "./debug/debug.mjs";

export const frameV2Debug: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Debug",
    version: "0.0.0",
    description: "FrameV2 Debug components",
  },
  list: [debugComponent],
};
