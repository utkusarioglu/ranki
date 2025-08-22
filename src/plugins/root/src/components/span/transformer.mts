import type { PluginComponentTransformer } from "@ranki/package-api";
import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";

export const transformer: PluginComponentTransformer = (root) => {
  switch (root.kind) {
    case "leaf":
      const transformed = transformNodeLeaf(root, {
        tag: "span",
        classNames: "span-leaf",
        styles: "",
      });
      transformed.classNames += "CUSTOM VALUE";
      return transformed;
    case "parent":
      return transformNodeParent(
        root,
        {
          tag: "span",
          classNames: "span-parent",
          styles: "",
        },
        [],
      );
  }
};
