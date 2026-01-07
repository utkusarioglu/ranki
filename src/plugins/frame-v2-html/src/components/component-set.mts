import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { frameV2AnchorComponent } from "./anchor/anchor.mjs";

export const frameV2Html: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Html",
    version: "0.0.0",
    description: "FrameV2 Html elements",
  },
  list: [frameV2AnchorComponent],
};
