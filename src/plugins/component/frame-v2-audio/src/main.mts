import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { flowchartComponent } from "./components/tone/component.mjs";

export const rankiFrameV2ComponentsPluginAudio: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2:Audio",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [flowchartComponent],
};
