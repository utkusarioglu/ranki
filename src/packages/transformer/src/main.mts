import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";
import type {
  ApiStageValidated,
  ApiStageTransformed,
  TransformNode,
  ValidationNode,
} from "@ranki/package-api";

function recurse(root: ValidationNode): TransformNode {
  switch (root.kind) {
    case "leaf":
      return transformNodeLeaf(root);
    case "parent":
      const children = root.children.map((c) => recurse(c));
      return transformNodeParent(root, children);
  }
}

export function transform(
  validated: ApiStageValidated,
): Promise<ApiStageTransformed> {
  return Promise.resolve({
    ...validated,
    stage: "transformed",
    transformed: recurse(validated.validated),
  });
}
