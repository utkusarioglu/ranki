import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { envInfoYaml } from "./env-info-yaml/env-info-yaml.mjs";
import { envInfoQr } from "./env-info-qr/env-info-qr.mjs";

export const debugRenderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Debug",
    engine: "DqmStaticRenderer",
    description:
      "Provides easily discernable structures for debugging rendering issues",
    version: "0.0.0",
  },
  list: [...envInfoYaml, ...envInfoQr],
};
