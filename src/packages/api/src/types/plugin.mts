import type * as ohm from "ohm-js";
import type {
  AstNodeDefinite,
  AstNodeLeaf,
  AstNodeParentDefinite,
  AstNodeParentIndefinite,
} from "./stages/ast.mjs";
import type { ValidationNode } from "./stages/validation.mjs";
import type { RenderNodeParent, RenderNodeLeaf } from "./stages/render.mjs";
import type { TransformNode } from "./stages/transform.mjs";
import type { RankiContext } from "./context.mjs";

export type PluginComponentParser = (
  nodes: Record<string, ohm.Node>,
  context: RankiContext,
  // source: ohm.Node,
) => AstNodeParentIndefinite | AstNodeParentDefinite | AstNodeLeaf;

export type PluginComponentValidator = (
  a: AstNodeDefinite,
) => Pick<ValidationNode, "errors" | "warnings">;

export type PluginComponentRenderer = (
  params: TransformNode,
) => RenderNodeParent | RenderNodeLeaf;

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
