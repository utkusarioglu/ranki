import type { PluginComponent } from "@ranki/package-api";

export const pre: PluginComponent = {
  parser: {
    types: ["pre"],
    action: async () => (await import("./parser.mjs")).parser,
  },
  validator: {
    types: ["pre"],
    action: async () => (await import("./validator.mjs")).validator,
  },
  transformer: {
    types: ["pre"],
    action: async () => (await import("./transformer.mjs")).transformer,
  },
  renderer: {
    types: ["pre"],
    action: async () => (await import("./renderer.mjs")).renderer,
  },
};
