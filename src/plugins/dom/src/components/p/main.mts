import type { PluginComponent } from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";
// import { parser } from "./parser.mjs";

export const p: PluginComponent = {
  parser: {
    types: [PARSE_TYPES.paragraph],
    action: async () => (await import("./parser.mjs")).parser,
  },
  validator: {
    types: ["paragraph"],
    action: async () => (await import("./validator.mjs")).validator,
  },
  transformer: {
    types: ["paragraph"],
    action: async () => (await import("./transformer.mjs")).transformer,
  },
};
