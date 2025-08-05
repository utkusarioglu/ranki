import type { WARNINGS, ERRORS } from "../constants/main.mjs";
import type {
  AstNodeConfiguration,
  AstNodeParameter,
  AstNodePrimitive,
} from "../types/ast.mjs";

type ValidationNodeWarning = (typeof WARNINGS)[keyof typeof WARNINGS];
type ValidationNodeError = (typeof ERRORS)[keyof typeof ERRORS];

export type ValidationNode = ValidationNodeParent | ValidationNodeLeaf;

interface ValidationNodeCommon {
  type: string;
  warnings: ValidationNodeWarning[];
  errors: ValidationNodeError[];

  configuration: AstNodeConfiguration[];
  parameters: AstNodeParameter[];
  attributes: AstNodeParameter[];
}

export type ValidationNodeParent = ValidationNodeCommon & {
  kind: "parent";
  children: ValidationNode[];
};

export type ValidationNodeLeaf = ValidationNodeCommon & {
  kind: "leaf";
  source: AstNodePrimitive;
};
