import { container } from "./container.mjs";
import { section } from "./section.mjs";
import type { RankiRenderPluginItem } from "@ranki/package-render-v2";

const common = ["computer_science", "code"];

export const renderer: RankiRenderPluginItem[] = [
  {
    tag: [...common, "container", "inline"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: container,
  },
  {
    tag: [...common, "section", "inline"].join("."),
    engine: "vanilla-js",
    load: "static",
    renderer: section,
  },
  {
    tag: [...common, "text", "inline"].join("."),
    engine: "vanilla-js",
    load: "lazy",
    renderer: () => import("./text.mjs").then((i) => i.text),
  },
];
