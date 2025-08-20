import type { PluginComponent } from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";
import { parser } from "./parser.mjs";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";

export const directive: PluginComponent = {
  parser: {
    types: [PARSE_TYPES.directive],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["directive"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["directive"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["directive"],
    action: () => Promise.resolve(renderer),
  },
};
