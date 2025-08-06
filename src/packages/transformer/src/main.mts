import {
  transformNodeLeaf,
  transformNodeParent,
} from "@ranki/package-api/helpers";
import type {
  ApiStageValidated,
  ApiStageTransformed,
  TransformNode,
  ValidationNode,
  TransformNodeParent,
} from "@ranki/package-api";
import type { Plugins } from "@ranki/package-plugins";
import { PluginComponentTransformer } from "../../api/src/types/plugin.mjs";

async function rootTransformer(root: ValidationNode) {
  switch (root.kind) {
    case "leaf":
      return transformNodeLeaf;
    case "parent":
      return transformNodeParent;
  }
  // return () => ({
  //   errors: [`ROOT: ${root.type}`],
  //   warnings: [`ROOT: ${root.type}`],
  // });
}

function getTransformer(
  root: ValidationNode,
  plugins: Plugins,
): Promise<PluginComponentTransformer> {
  switch (root.type) {
    case "document":
    case "directive":
    case "paragraph":
    case "HEADING":
    case "line":
    case "word":
      // @ts-expect-error this will fix itself soon
      return rootTransformer(root);
    default:
      return plugins.getTransformer(root.type);
  }
}

async function recursiveTransformation(
  root: ValidationNode,
  plugins: Plugins,
): Promise<TransformNode> {
  const transformer = await getTransformer(root, plugins);
  switch (root.kind) {
    case "leaf":
      return transformer(root);
    case "parent":
      const children = await Promise.all(
        root.children.map((c) => recursiveTransformation(c, plugins)),
      );
      const transformed = transformer(root) as TransformNodeParent;
      transformed.children = children;
      return transformed;
  }
}

export async function transform(
  validated: ApiStageValidated,
  plugins: Plugins,
): Promise<ApiStageTransformed> {
  return Promise.resolve({
    ...validated,
    stage: "transformed",
    transformed: await recursiveTransformation(validated.validated, plugins),
  });
}
