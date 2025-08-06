import type { Plugins } from "@ranki/package-plugins";
import type {
  ApiStageParsed,
  ApiStageValidated,
  AstNodeDefinite,
  PluginComponentValidator,
  ValidationNode,
} from "@ranki/package-api";
import {
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";

function rootValidator(root: AstNodeDefinite) {
  return () => ({
    errors: [`ROOT: ${root.type}`],
    warnings: [`ROOT: ${root.type}`],
  });
}

async function getValidator(
  root: AstNodeDefinite,
  plugins: Plugins,
): Promise<PluginComponentValidator> {
  switch (root.type) {
    case "document":
    case "directive":
    case "paragraph":
    case "HEADING":
    case "line":
    case "word":
      return rootValidator(root);
    default:
      return plugins.getValidator(root.type);
  }
}

async function recursiveValidation(
  root: AstNodeDefinite,
  plugins: Plugins,
): Promise<ValidationNode> {
  const validator = await getValidator(root, plugins);

  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, validator(root));
    case "parent":
      const children = await Promise.all(
        root.children.map(async (n) => recursiveValidation(n, plugins)),
      );

      return validationNodeParent(root, validator(root), children);
  }
}

export async function validate(
  parsed: ApiStageParsed,
  plugins: Plugins,
): Promise<ApiStageValidated> {
  return Promise.resolve({
    ...parsed,
    stage: "validated",
    validated: await recursiveValidation(parsed.ast, plugins),
  });
}
