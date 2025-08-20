import type {
  // ValidationNode,
  // TransformNode,
  PluginComponentTransformer,
  // RenderNodeLeaf,
  // RenderNodeParent,
} from "@ranki/package-api";
import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";
// import { Html } from "@ranki/package-html";

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
export const transformer: PluginComponentTransformer = (root) => {
  switch (root.kind) {
    case "leaf":
      const transformed = transformNodeLeaf(root, {
        tag: "p",
        classNames: "p-leaf",
        styles: "aa",
      });
      // transformed.classNames += " ROOT DIRECTIVE";
      return transformed;
    case "parent":
      return transformNodeParent(
        root,
        {
          tag: "p",
          classNames: "p-parent",
          styles: "color: red;",
        },
        [],
      );
  }
};
// export function renderer(t: TransformNode): RenderNodeLeaf | RenderNodeParent {
//   switch (t.kind) {
//     case "leaf":
//       const leafElem = Html.single(t.tag, {
//         format: "text",
//         content: t.text,
//       });
//       return {
//         selector: "made-up-selector-01",
//         component: "made-up-component",
//         element: leafElem,
//       };
//     case "parent":
//       const parentElem = Html.single(t.tag, {
//         format: "html",
//         children: [],
//         // content: JSON.stringify(t),
//       });
//       return {
//         selector: "made-up-selector-01",
//         component: "made-up-component",
//         element: parentElem,
//         inserts: {
//           children: parentElem,
//         },
//       };
//   }
// }
