import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { container } from "./sym-graph/container.mjs";

const common = ["frame", "v2", "math", "symbolic", "plot"];

export const renderPluginFrameV2Nerdamer: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Nerdamer",
    version: "0.0.0",
  },
  items: [
    {
      tag: [...common, "container", "block"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: container,
    },
    {
      tag: [...common, "section", "block"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./sym-graph/section.mjs").then((i) => i.section),
    },
  ],
};
