import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { codeContainer } from "./code/container.mjs";

export const renderPluginFrameV2Code: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Code",
    version: "0.0.0",
  },
  items: [
    {
      tag: "computer_science.code.block.container",
      engine: "vanilla-js",
      load: "static",
      renderer: codeContainer,
    },
    {
      tag: "computer_science.code.block.section",
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./code/section.mjs").then((i) => i.codeSection),
    },
  ],
};
