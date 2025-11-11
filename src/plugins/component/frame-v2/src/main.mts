import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { blockV2Component } from "./components/block/block.component.mjs";

export const rankiFrameV2ComponentsPlugin: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [blockV2Component],
};
