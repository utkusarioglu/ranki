import type {
  ApiStageValidated,
  ApiStageTransformed,
  TransformNode,
  ValidationNode,
  TransformNodeParent,
  RankiContext,
} from "@ranki/package-api";
// import { NODE_TYPES } from "@ranki/package-api/constants";

async function recursiveTransformation(
  root: ValidationNode,
  context: RankiContext,
): Promise<TransformNode> {
  const transformer = await context.plugins.getTransformer(root.type);
  switch (root.kind) {
    case "leaf":
      return transformer(root);
    case "parent":
      const children = await Promise.all(
        root.children.map((c) => recursiveTransformation(c, context)),
      );

      // const children = [];
      // root.children.forEach(async (c) => {
      //   const t = await recursiveTransformation(c, context);
      //   t.forEach((i) => children.push(i));
      // });

      // if (root.type === NODE_TYPES.document) {
      //   return children;
      // } else {
      const transformed = transformer(root) as TransformNodeParent;
      transformed.children = children;
      return transformed;
    // }
  }
}

export async function transform(
  validated: ApiStageValidated,
  context: RankiContext,
): Promise<ApiStageTransformed> {
  return Promise.resolve({
    ...validated,
    stage: "transformed",
    // transformed: await Promise.all([
    //   recursiveTransformation(validated.validated, context),
    // ]),
    transformed: await recursiveTransformation(validated.validated, context),
  });
}
