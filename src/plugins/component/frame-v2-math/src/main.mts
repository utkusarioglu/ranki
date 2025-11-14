import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { latexComponent } from "./components/latex/component.mjs";
import { symbolicGraphComponent } from "./components/symbolic-graph/component.mjs";

export const rankiFrameV2ComponentsPluginMath: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2:Latex",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [latexComponent, symbolicGraphComponent],
};
