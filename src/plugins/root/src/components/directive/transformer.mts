import type { PluginComponentTransformer } from "@ranki/package-api";
import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";

export const transformer: PluginComponentTransformer = (root) => {
  switch (root.kind) {
    case "leaf":
      // @ts-expect-error expects the `adds` param
      const transformed = transformNodeLeaf(root);
      return transformed;
    case "parent":
      // @ts-expect-error expects the `adds` param
      return transformNodeParent(root, []);
  }
};
