import type { PluginComponent } from "@ranki/package-api";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";
import { parser } from "./parser.mjs";

export const others: PluginComponent = {
  parser: {
    types: ["others"],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["line", "heading"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["line", "heading"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["line", "heading", "span", "p"],
    action: () => Promise.resolve(renderer),
  },
};
