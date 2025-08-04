import type { AstNode } from "./ast-node.mjs";
import type { ValidationNode } from "./validation.mjs";
import type { TransformNode } from "./transformation.mjs";
import type { RenderedNode } from "./rendered.mjs";

export interface ApiStageParsed {
  stage: "parsed";
  ast: AstNode;
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
  rendered: RenderedNode;
};
