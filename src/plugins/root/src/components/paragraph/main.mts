// import type {
//   AstNodeDefinite,
//   ValidationNode,
//   TransformNode,
//   RenderNodeLeaf,
//   RenderNodeParent,
// } from "@ranki/package-api";
// import {
//   transformNodeLeaf,
//   transformNodeParent,
//   validationNodeLeaf,
//   validationNodeParent,
// } from "@ranki/package-api/helpers";

// function validator(root: AstNodeDefinite): ValidationNode {
//   const errorsAndWarnings: Pick<ValidationNode, "errors" | "warnings"> = {
//     errors: [`ROOT DEBUG: ${root.type}`],
//     warnings: [`ROOT DEBUG: ${root.type}`],
//   };
//   switch (root.kind) {
//     case "leaf":
//       return validationNodeLeaf(root, errorsAndWarnings);
//     case "parent":
//       return validationNodeParent(root, errorsAndWarnings, []);
//   }
// }

// function transformer(root: ValidationNode): TransformNode {
//   switch (root.kind) {
//     case "leaf":
//       const transformed = transformNodeLeaf(root, {
//         tag: "p",
//         classNames: "p-leaf",
//         styles: "aa",
//       });
//       // transformed.classNames += " ROOT DIRECTIVE";
//       return transformed;
//     case "parent":
//       return transformNodeParent(
//         root,
//         {
//           tag: "p",
//           classNames: "p-parent",
//           styles: "color: red;",
//         },
//         [],
//       );
//   }
// }

import type { PluginComponent } from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";
import { parser } from "./parser.mjs";
import { validator } from "./validator.mjs";
import { transformer } from "./transformer.mjs";
import { renderer } from "./renderer.mjs";

export const paragraph: PluginComponent = {
  parser: {
    types: [PARSE_TYPES.paragraph],
    action: () => Promise.resolve(parser),
  },
  validator: {
    types: ["paragraph"],
    action: () => Promise.resolve(validator),
  },
  transformer: {
    types: ["paragraph"],
    action: () => Promise.resolve(transformer),
  },
  renderer: {
    types: ["paragraph"],
    action: () => Promise.resolve(renderer),
  },
};
