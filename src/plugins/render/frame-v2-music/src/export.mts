import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { easyScoreRenderers } from "./renderers/easyscore/renderers.mjs";
import { osmdYmlRenderers } from "./renderers/osmd-yml/renderers.mjs";
import { osmdXmlRenderers } from "./renderers/osmd-xml/renderers.mjs";
import { vexchordsRenderers } from "./renderers/vexchords/renderers.mjs";

export const renderPluginFrameV2Music: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Music",
    version: "0.0.0",
  },
  items: [
    //
    ...easyScoreRenderers,
    ...osmdYmlRenderers,
    ...osmdXmlRenderers,
    ...vexchordsRenderers,
  ],
};
