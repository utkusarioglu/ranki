import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { latexContainer } from "./latex/container.mjs";

export const renderPluginFrameV2Latex: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Latex",
    version: "0.0.0",
  },
  items: [
    {
      tag: ["frame", "v2", "math", "latex", "block", "container"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: latexContainer,
    },
    {
      tag: ["frame", "v2", "math", "latex", "block", "section"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./latex/section.mjs").then((i) => i.latexSection),
    },
  ],
};
