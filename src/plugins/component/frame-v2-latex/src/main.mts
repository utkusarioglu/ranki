import type { RankiPluginComponent } from "@ranki/package-api-v2";
import { latexComponent } from "./components/latex/latex.component.mjs";

export const rankiFrameV2ComponentsPluginLatex: RankiPluginComponent = {
  meta: {
    name: "RankiFrameV2Latex",
    version: "0.0.0",
  },
  handler: "RankiFrameV2",
  list: [latexComponent],
};
