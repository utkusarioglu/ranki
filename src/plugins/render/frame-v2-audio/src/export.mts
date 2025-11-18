import type { RankiPluginRenderer } from "@ranki/package-render-v2";
import { tonesContainer } from "./tones/container.mjs";

export const renderPluginFrameV2Audio: RankiPluginRenderer = {
  type: "renderer",
  meta: {
    name: "FrameV2:Audio",
    version: "0.0.0",
  },
  items: [
    {
      tag: ["audio", "audio-context", "tone-js", "container", "block"].join(
        ".",
      ),
      engine: "vanilla-js",
      load: "static",
      renderer: tonesContainer,
    },
    {
      tag: ["audio", "audio-context", "tone-js", "section", "block"].join("."),
      engine: "vanilla-js",
      load: "lazy",
      renderer: () => import("./tones/section.mjs").then((i) => i.section),
    },
  ],
};
