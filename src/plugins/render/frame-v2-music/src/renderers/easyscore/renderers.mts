import { tonesContainer } from "./container.mjs";
import type { RankiRenderPluginItem } from "@ranki/package-render-v2";

const commonTags = ["music", "score", "vexflow", "easyscore"];

export const easyScoreRenderers: RankiRenderPluginItem[] = [
  {
    tag: [...commonTags, "container", "block"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: tonesContainer,
  },
  {
    tag: [...commonTags, "section", "block"].join("."),
    engine: "vanilla-js",
    load: "lazy",
    renderer: () => import("./section.mjs").then((i) => i.section),
  },
];
