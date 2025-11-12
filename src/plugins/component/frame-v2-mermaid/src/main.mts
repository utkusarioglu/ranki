import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { flowchartComponent } from "./components/flowchart/flowchart.component.mjs";

export const rankiFrameV2ComponentsPluginMermaid: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2:Mermaid",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [flowchartComponent],
};
