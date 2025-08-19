import type {
  TransformNodeLeaf,
  TransformNode,
  TransformNodeParent,
  TransformNodeAdds,
} from "../types/stages/transform.mjs";
import {
  ValidationNodeLeaf,
  ValidationNodeParent,
} from "../types/stages/validation.mjs";

export function transformNodeLeaf(
  validationNode: ValidationNodeLeaf,
  adds: TransformNodeAdds,
): TransformNodeLeaf {
  return {
    kind: "leaf",
    type: validationNode.type,
    classNames: validationNode.kind,
    styles: "color: pink;",
    text: validationNode.source.toString(),
    ...adds,
  };
}

export function transformNodeParent(
  validationNode: ValidationNodeParent,
  adds: TransformNodeAdds,
  children: TransformNode[],
): TransformNodeParent {
  return {
    kind: "parent",
    type: validationNode.type,
    classNames: validationNode.kind,
    styles: "color: red;",
    children,
    ...adds,
  };
}
