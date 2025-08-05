import type {
  AstNodeLeaf,
  AstNodeParentIndefinite,
  AstNodeUnparsed,
  AstNodeParentDefinite,
} from "../types/ast.mjs";
import type {
  TransformNodeLeaf,
  TransformNodeParent,
  TransformNode,
} from "../types/transform.mjs";
import {
  ValidationNodeParent,
  ValidationNodeLeaf,
} from "../types/validation.mjs";

type Params<Base, Required extends keyof Base> = Pick<Base, Required> &
  Partial<Omit<Base, "kind" | Required>>;

export function astNodeUnparsed(
  params: Params<AstNodeUnparsed, "ohm" | "type">,
): AstNodeUnparsed {
  return {
    kind: "unparsed",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    ohm: params.ohm,
  };
}

export function astNodeParentIndefinite(
  params: Params<AstNodeParentIndefinite, "children" | "type">,
): AstNodeParentIndefinite {
  return {
    kind: "parent",
    completion: "indefinite",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    children: params.children,
  };
}

export function astNodeParentDefinite(
  params: Params<AstNodeParentDefinite, "type" | "children">,
): AstNodeParentDefinite {
  return {
    kind: "parent",
    completion: "definite",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    children: params.children,
  };
}

export function astNodeLeaf(
  params: Params<AstNodeLeaf, "type" | "source">,
): AstNodeLeaf {
  return {
    kind: "leaf",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    source: params.source,
  };
}

// export function validationNode(
//   astNode: AstNodeDefinite,
//   adds: Partial<ValidationNodeParent>,
// ): ValidationNode {
//   const warnings: ValidationNode["warnings"] = [];
//   const errors: ValidationNode["errors"] = [];

//   switch (astNode.kind) {
//     case "leaf":
//       return {
//         ...astNode,
//         ...adds,
//         // warnings,
//         // errors,
//       };
//     case "parent":
//       const children = astNode.children as ValidationNode[];
//       return {
//         ...astNode,
//         ...adds,
//         // warnings,
//         // errors,
//         children,
//       };
//   }
// }

export function validationNodeParent(
  astNode: Omit<AstNodeParentDefinite, "children">,
  adds: Partial<Pick<ValidationNodeParent, "errors" | "warnings">> &
    Pick<ValidationNodeParent, "children">,
): ValidationNodeParent {
  return {
    ...astNode,
    errors: adds.errors || [],
    warnings: adds.errors || [],
    children: adds.children,
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

export function transformNodeLeaf(
  validationNode: ValidationNodeLeaf,
): TransformNodeLeaf {
  return {
    tag: validationNode.type,
    classNames: validationNode.kind,
    styles: "color: pink;",
    text: validationNode.source.toString(),
  };
}

export function transformNodeParent(
  validationNode: ValidationNodeParent,
  children: TransformNode[],
): TransformNodeParent {
  return {
    tag: validationNode.type,
    classNames: validationNode.kind,
    styles: "color: red;",
    children,
  };
}
