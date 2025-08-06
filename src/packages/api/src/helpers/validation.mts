import type {
  AstNodeParentDefinite,
  AstNodeLeaf,
  AstNodeParentIndefinite,
} from "../types/stages/ast.mjs";
import {
  ValidationNodeParent,
  ValidationNodeLeaf,
} from "../types/stages/validation.mjs";

export function validationNodeParent(
  // astNode: Omit<AstNodeParentDefinite, "children">,
  astNode: AstNodeParentDefinite | AstNodeParentIndefinite,
  adds: Partial<Pick<ValidationNodeParent, "errors" | "warnings">>,
  children: ValidationNodeParent["children"],
): ValidationNodeParent {
  const { kind, type, completion, parameters, configuration, attributes } =
    astNode;
  return {
    // ...astNode,

    kind,
    type,
    completion,
    parameters,
    configuration,
    attributes,
    errors: adds.errors || [],
    warnings: adds.errors || [],
    children,
  };
}

export function validationNodeLeaf(
  astNode: AstNodeLeaf,
  adds: Partial<Pick<ValidationNodeParent, "errors" | "warnings">>,
): ValidationNodeLeaf {
  return {
    ...astNode,
    errors: adds.errors || [],
    warnings: adds.errors || [],
  };
}
