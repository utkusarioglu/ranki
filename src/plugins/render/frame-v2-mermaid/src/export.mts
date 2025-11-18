import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { mermaidContainer } from "./mermaid/container.mjs";

export const renderPluginFrameV2Mermaid: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Mermaid",
    version: "0.0.0",
  },
  items: [
    {
      tag: ["graphing", "mermaid", "container", "block"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: mermaidContainer,
    },
    {
      tag: ["graphing", "mermaid", "section", "block"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () =>
        import("./mermaid/section.mjs").then((i) => i.mermaidSection),
    },
  ],
};
