import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { easyScoreRenderers } from "./easyscore/renderers.mjs";
import { osmdYmlRenderers } from "./osmd-yml/renderers.mjs";

export const renderPluginFrameV2Music: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Music",
    version: "0.0.0",
  },
  items: [
    ...easyScoreRenderers,
    ...osmdYmlRenderers,
    // {
    //   tag: [
    //     "music",
    //     "score",
    //     "vexflow",
    //     "easyscore",
    //     "block",
    //     "container",
    //   ].join("."),
    //   engine: "vanilla-js",
    //   load: "static",
    //   renderer: tonesContainer,
    // },
    // {
    //   tag: ["music", "score", "vexflow", "easyscore", "block", "section"].join(
    //     ".",
    //   ),
    //   engine: "vanilla-js",
    //   load: "lazy",
    //   renderer: () => import("./easyscore/section.mjs").then((i) => i.section),
    // },
  ],
};
