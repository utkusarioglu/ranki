import type {
  TransformNodeLeaf,
  TransformNode,
  TransformNodeParent,
} from "../types/stages/transform.mjs";
import {
  ValidationNodeLeaf,
  ValidationNodeParent,
} from "../types/stages/validation.mjs";

export function transformNodeLeaf(
  validationNode: ValidationNodeLeaf,
): TransformNodeLeaf {
  return {
    kind: "leaf",
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
    kind: "parent",
    tag: validationNode.type,
    classNames: validationNode.kind,
    styles: "color: red;",
    children,
  };
}
