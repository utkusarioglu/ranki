import type * as ohm from "ohm-js";
import type {
  AstNodeDefinite,
  AstNodeLeaf,
  AstNodeParentDefinite,
  AstNodeParentIndefinite,
} from "./ast.mjs";
import type { ValidationNode } from "./validation.mjs";
import type { RenderNode } from "./render.mjs";
import { TransformNode } from "./transform.mjs";

export type PluginComponentParser = (
  source: ohm.Node,
) => AstNodeParentIndefinite | AstNodeParentDefinite | AstNodeLeaf;

export type PluginComponentValidator = (a: AstNodeDefinite) => ValidationNode;

export type PluginComponentRenderer = (params: TransformNode) => RenderNode;

export type PluginComponentTransformer = (n: ValidationNode) => TransformNode;

export type FrameTagString = string;

interface PluginMetadata {
  name: string;
}

export interface PluginComponentStages {
  parser: PluginComponentParser;
  validator: PluginComponentValidator;
  transformer: PluginComponentTransformer;
  renderer: PluginComponentRenderer;
}

export type PluginComponentStage = keyof PluginComponentStages;

interface PluginComponent {
  tags: FrameTagString[];
  stages: () => Promise<PluginComponentStages>;
}

export interface Plugin {
  metadata: PluginMetadata;
  components: PluginComponent[];
}
