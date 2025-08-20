import type {
  ValidationNode,
  TransformNode,
  PluginComponentTransformer,
} from "@ranki/package-api";
import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";

export const transformer: PluginComponentTransformer = (root) => {
  switch (root.kind) {
    case "leaf":
      const transformed = transformNodeLeaf(root, {
        tag: "span",
        classNames: "other-leaf",
        styles: "aa",
      });
      // transformed.classNames += " ROOT DIRECTIVE";
      return transformed;
    case "parent":
      return transformNodeParent(
        root,
        {
          tag: "span",
          classNames: "other-parent",
          styles: "color: red;",
        },
        [],
      );
  }
};
