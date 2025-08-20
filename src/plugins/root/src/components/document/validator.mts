import type { AstNodeDefinite, ValidationNode } from "@ranki/package-api";
import {
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";

export const validator = (root: AstNodeDefinite): ValidationNode => {
  const errorsAndWarnings: Pick<ValidationNode, "errors" | "warnings"> = {
    errors: [`ROOT DEBUG: ${root.type}`],
    warnings: [`ROOT DEBUG: ${root.type}`],
  };
  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, errorsAndWarnings);
    case "parent":
      return validationNodeParent(root, errorsAndWarnings, []);
  }
};

// export default validator;
