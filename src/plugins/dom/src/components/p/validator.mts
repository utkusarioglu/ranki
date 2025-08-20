import type {
  PluginComponentValidator,
  ValidationNode,
} from "@ranki/package-api";
import {
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";

export const validator: PluginComponentValidator = (root) => {
  const errorsAndWarnings: Pick<ValidationNode, "errors" | "warnings"> = {
    errors: [`DOM DEBUG: ${root.type}`],
    warnings: [`DOM DEBUG: ${root.type}`],
  };
  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, errorsAndWarnings);
    case "parent":
      return validationNodeParent(root, errorsAndWarnings, []);
  }
};
