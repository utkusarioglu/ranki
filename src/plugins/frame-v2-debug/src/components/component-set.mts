import type { IDqmPluginComponentSet } from "@dqm/package-dqm-api-v2";
import { environmentInfoYaml } from "./env-info-yaml/env-info-yaml.mjs";
import { environmentInfoQr } from "./env-info-qr/env-info-qr.mjs";
import { domInfo } from "./dom-info/dom-info.mjs";
import { palette } from "./palette/palette.mjs";

export const frameV2Debug: IDqmPluginComponentSet = {
  type: "component-set",
  meta: {
    name: "FrameV2:Debug",
    version: "0.0.0",
    description: "FrameV2 Debug components",
  },
  list: [environmentInfoYaml, environmentInfoQr, domInfo, palette],
};
