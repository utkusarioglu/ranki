import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { latexRenderer } from "./latex/renderer.mjs";

export const renderPluginFrameV2Latex: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2Latex",
    version: "0.0.0",
  },
  items: [
    {
      tag: ["frame", "v2", "math", "latex", "block", "container"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: latexRenderer,
    },
    {
      tag: ["frame", "v2", "math", "latex", "block", "section"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./latex/section.mjs").then((i) => i.latexSection),
    },
  ],
};
