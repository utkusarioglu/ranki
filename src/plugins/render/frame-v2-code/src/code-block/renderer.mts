import { container } from "./container.mjs";
import { section } from "./section.mjs";
import type { RankiRenderPluginItem } from "@ranki/package-render-v2";

// const commonTags = ["music", "score", "vexflow", "easyscore"];
const common = ["computer_science", "code"];

export const renderer: RankiRenderPluginItem[] = [
  {
    tag: [...common, "container", "block"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: container,
  },
  {
    tag: [...common, "section", "block"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: section,
  },
  {
    tag: [...common, "text", "block"].join("."),
    engine: "vanilla-js",
    load: "lazy",
    renderer: () => import("./text.mjs").then((i) => i.text),
  },
];
