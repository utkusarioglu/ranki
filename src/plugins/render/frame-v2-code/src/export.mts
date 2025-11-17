import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { container as codeBlockContainer } from "./code-block/container.mjs";
import { container as codeInlineContainer } from "./code-inline/container.mjs";

export const renderPluginFrameV2Code: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Code",
    version: "0.0.0",
  },
  items: [
    {
      tag: ["computer_science", "code", "container", "block"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: codeBlockContainer,
    },
    {
      tag: ["computer_science", "code", "section", "block"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () =>
        import("./code-block/section.mjs").then((i) => i.codeSection),
    },

    {
      tag: ["computer_science", "code", "container", "inline"].join("."),
      engine: "vanilla-js",
      load: "static",
      renderer: codeInlineContainer,
    },
    {
      tag: ["computer_science", "code", "section", "inline"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () =>
        import("./code-inline/section.mjs").then((i) => i.codeSection),
    },
  ],
};
