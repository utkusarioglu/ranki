import type { AstNodeDefinite } from "./stages/ast.mjs";
import type { ValidationNode } from "./stages/validation.mjs";
import type { TransformNode } from "./stages/transform.mjs";
import type { RenderNodeParent, RenderNodeLeaf } from "./stages/render.mjs";

export interface ApiStageParsed {
  stage: "parsed";
  ast: AstNodeDefinite;
}

export type ApiStageValidated = Omit<ApiStageParsed, "stage"> & {
  stage: "validated";
  validated: ValidationNode;
};

export type ApiStageTransformed = Omit<ApiStageValidated, "stage"> & {
  stage: "transformed";
  transformed: TransformNode;
};

export type ApiStageRendered = Omit<ApiStageTransformed, "stage"> & {
  stage: "rendered";
  rendered: RenderNodeParent | RenderNodeLeaf;
};
