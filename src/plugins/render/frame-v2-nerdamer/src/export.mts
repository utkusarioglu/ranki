import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { container } from "./sym-graph/container.mjs";

const common = ["frame", "v2", "math", "symbolic", "plot", "block"];

export const renderPluginFrameV2Nerdamer: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Nerdamer",
    version: "0.0.0",
  },
  items: [
    {
      tag: [...common, "container"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: container,
    },
    {
      tag: [...common, "section"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./sym-graph/section.mjs").then((i) => i.section),
    },
  ],
};
