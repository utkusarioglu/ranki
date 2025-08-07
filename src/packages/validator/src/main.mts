import type {
  ApiStageParsed,
  ApiStageValidated,
  AstNodeDefinite,
  // PluginComponentValidator,
  RankiContext,
  ValidationNode,
} from "@ranki/package-api";
import {
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";

// function rootValidator(root: AstNodeDefinite) {
//   return () => ({
//     errors: [`ROOT: ${root.type}`],
//     warnings: [`ROOT: ${root.type}`],
//   });
// }

// async function getValidator(
//   root: AstNodeDefinite,
//   context: RankiContext,
// ): Promise<PluginComponentValidator> {
//   switch (root.type) {
//     case "document":
//     case "directive":
//     case "paragraph":
//     case "HEADING":
//     case "line":
//     case "word":
//       return rootValidator(root);
//     default:
//       return context.plugins.getValidator(root.type);
//   }
// }

async function recursiveValidation(
  root: AstNodeDefinite,
  context: RankiContext,
): Promise<ValidationNode> {
  const validator = await context.plugins.getValidator(root.type);
  // const validator = await getValidator(root, context);

  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, validator(root));
    case "parent":
      const children = await Promise.all(
        root.children.map(async (n) => recursiveValidation(n, context)),
      );

      return validationNodeParent(root, validator(root), children);
  }
}

export async function validate(
  parsed: ApiStageParsed,
  context: RankiContext,
): Promise<ApiStageValidated> {
  return Promise.resolve({
    ...parsed,
    stage: "validated",
    validated: await recursiveValidation(parsed.ast, context),
  });
}
