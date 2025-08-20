import type {
  // AstNodeDefinite,
  // PluginComponentStages,
  // ValidationNode,
  // TransformNode,
  // RenderNodeLeaf,
  // RenderNodeParent,
  PluginComponent,
} from "@ranki/package-api";

export const span: PluginComponent = {
  parser: {
    types: ["span"],
    action: async () => (await import("./parser.mjs")).parser,
  },
  validator: {
    types: ["span"],
    action: async () => (await import("./validator.mjs")).validator,
  },
  transformer: {
    types: ["span"],
    action: async () => (await import("./transformer.mjs")).transformer,
  },
  // renderer,
};
