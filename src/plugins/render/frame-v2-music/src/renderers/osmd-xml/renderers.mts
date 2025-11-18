import type { RankiRenderPluginItem } from "@ranki/package-render-v2";
import { container } from "./container.mjs";

const commonTags = ["music", "score", "osmd", "musicxml", "xml"];

export const osmdXmlRenderers: RankiRenderPluginItem[] = [
  {
    tag: [...commonTags, "container", "block"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: container,
  },
  {
    tag: [...commonTags, "section", "block"].join("."),
    engine: "vanilla-js",
    load: "lazy",
    renderer: () => import("./section.mjs").then((i) => i.section),
  },
];
