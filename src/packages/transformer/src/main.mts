import type {
  ApiStageValidated,
  ApiStageTransformed,
  TransformNode,
  ValidationNode,
  TransformNodeParent,
  RankiContext,
} from "@ranki/package-api";
import { PARSE_TYPES } from "@ranki/package-api/constants";

async function recursiveTransformation(
  root: ValidationNode,
  context: RankiContext,
): Promise<TransformNode[]> {
  const transformer = await context.plugins.getTransformer(root.type);
  switch (root.kind) {
    case "leaf":
      return [transformer(root)];
    case "parent":
      const flatten = (items) => {
        return items.reduce((a, c) => {
          if (Array.isArray(c)) {
            return [...a, ...c];
          } else return [...a, c];
        }, [] as TransformNode[]);
      };

      const children = flatten(
        await Promise.all(
          root.children.map((c) => recursiveTransformation(c, context)),
        ),
      );

      switch (root.type) {
        case PARSE_TYPES.document:
        case PARSE_TYPES.directive:
        case PARSE_TYPES.line:
          return children;
        default:
          const transformed = transformer(root) as TransformNodeParent;
          transformed.children = children;
          return [transformed];
      }
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
