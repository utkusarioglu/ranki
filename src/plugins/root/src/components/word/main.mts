// const plugin: PluginComponentStages = {
//   parser,
//   validator,
//   transformer,
//   renderer,
// };

// export default plugin;

import type { PluginComponent } from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";
import { parser } from "./parser.mjs";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";

export const word: PluginComponent = {
  parser: {
    types: [PARSE_TYPES.word],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["word"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["word"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["word"],
    action: () => Promise.resolve(renderer),
  },
};
