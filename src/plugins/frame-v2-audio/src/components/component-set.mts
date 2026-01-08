import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { tones } from "./tones/component.mjs";
import { easyScore } from "./easyscore/component.mjs";

export const frameV2Tones: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Audio",
    version: "0.0.0",
    description: "Audio components",
  },
  list: [tones, easyScore],
};
