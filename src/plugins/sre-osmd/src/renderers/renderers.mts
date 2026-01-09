import type { IDqmPluginRenderer } from "@dqm/package-dqm-api-v2";
import { osmdYml } from "./osmd-yml/osmd-yml.mjs";

export const renderer: IDqmPluginRenderer = {
  type: "renderer",
  meta: {
    name: "Osmd",
    engine: "DqmStaticRenderer",
    description: "Audio renderers",
    version: "0.0.0",
  },
  list: [...osmdYml],
};
