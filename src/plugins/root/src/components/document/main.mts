import type { PluginComponent } from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";

import { parser } from "./parser.mjs";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";

export const document: PluginComponent = {
  parser: {
    types: [PARSE_TYPES.document],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["document"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["document"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["document"],
    action: () => Promise.resolve(renderer),
  },
};
