import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { frameV2CodeBlockComponent } from "./code/code.mjs";

export const frameV2Code: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Code",
    version: "0.0.0",
    description: "FrameV2 Code block component",
  },
  list: [frameV2CodeBlockComponent],
};
