import type { RankiRenderPluginItem } from "@ranki/package-render-v2";
import { container } from "./container.mjs";

const commonTags = ["music", "score", "osmd", "musicxml", "yml", "block"];

export const osmdYmlRenderers: RankiRenderPluginItem[] = [
  {
    tag: [...commonTags, "container"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: container,
  },
  {
    tag: [...commonTags, "section"].join("."),
    engine: "vanilla-js",
    load: "lazy",
    renderer: () => import("./section.mjs").then((i) => i.section),
  },
];
