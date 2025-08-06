import type { WARNINGS, ERRORS } from "../../constants/main.mjs";
import type {
  AstNodeConfiguration,
  AstNodeParameter,
  AstNodeParentDefinite,
  AstNodeParentIndefinite,
  AstNodePrimitive,
} from "./ast.mjs";

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
  completion: (AstNodeParentDefinite | AstNodeParentIndefinite)["completion"];
  children: ValidationNode[];
};

export type ValidationNodeLeaf = ValidationNodeCommon & {
  kind: "leaf";
  source: AstNodePrimitive;
};
