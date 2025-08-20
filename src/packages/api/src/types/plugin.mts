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
) => AstNodeParentIndefinite | AstNodeParentDefinite | AstNodeLeaf;

export type PluginComponentValidator = (
  a: AstNodeDefinite,
) => Pick<ValidationNode, "errors" | "warnings">;

export type PluginComponentRenderer = (
  params: TransformNode,
) => RenderNodeParent | RenderNodeLeaf;

export type PluginComponentTransformer = (n: ValidationNode) => TransformNode;

export type ParseType = string;
export type ValidationType = string;
export type TransformType = string;
export type RenderType = string;

interface PluginMetadata {
  name: string;
}

// export interface PluginComponentStages {
//   parser: PluginComponentParser;
//   validator: PluginComponentValidator;
//   transformer: PluginComponentTransformer;
//   renderer: PluginComponentRenderer;
// }

export type PluginComponentStageName = keyof PluginComponent;

export type PluginComponentStageSpec<TagType, ActionType> = {
  types: TagType[];
  action: () => Promise<ActionType>;
};

// interface PluginComponent {
//   tags: FrameTagString[];
//   stages: () => Promise<PluginComponentStages>;
// }

// export interface PluginComponentParserSpec {
//   parseTypes: ParseType[];
//   action: () => Promise<PluginComponentParser>;
// }

export type PluginComponentParserSpec = PluginComponentStageSpec<
  ParseType,
  PluginComponentParser
>;

// export interface PluginComponentValidatorSpec {
//   validationTypes: ValidationType[];
//   action: () => Promise<PluginComponentValidator>;
// }

export type PluginComponentValidatorSpec = PluginComponentStageSpec<
  ValidationType,
  PluginComponentValidator
>;

// export interface PluginComponentTransformerSpec {
//   transformTypes: TransformType[];
//   action: () => Promise<PluginComponentTransformer>;
// }

export type PluginComponentTransformerSpec = PluginComponentStageSpec<
  TransformType,
  PluginComponentTransformer
>;

// export interface PluginComponentRendererSpec {
//   renderTypes: RenderType[];
//   action: () => Promise<PluginComponentRenderer>;
// }

export type PluginComponentRendererSpec = PluginComponentStageSpec<
  RenderType,
  PluginComponentRenderer
>;

export interface PluginComponent {
  parser?: PluginComponentParserSpec;
  validator?: PluginComponentValidatorSpec;
  transformer?: PluginComponentTransformerSpec;
  renderer?: PluginComponentRendererSpec;
}

export interface Plugin {
  metadata: PluginMetadata;
  components: PluginComponent[];
}
