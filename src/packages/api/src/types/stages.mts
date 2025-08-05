import type { AstNodeDefinite } from "./ast.mjs";
import type { ValidationNode } from "./validation.mjs";
import type { TransformNode } from "./transform.mjs";
import type { RenderNode } from "./render.mjs";

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
  rendered: RenderNode;
};
