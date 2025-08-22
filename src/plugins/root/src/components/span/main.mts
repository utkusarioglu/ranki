import type {
  // AstNodeDefinite,
  // PluginComponentStages,
  // ValidationNode,
  // TransformNode,
  // RenderNodeLeaf,
  // RenderNodeParent,
  PluginComponent,
} from "@ranki/package-api";
import { parser } from "./parser.mjs";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";

export const span: PluginComponent = {
  parser: {
    types: ["span"],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["span", "lineBreak", "spacePlus"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["span", "lineBreak", "spacePlus"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["span", "spacePlus"],
    action: () => Promise.resolve(renderer),
  },
};
