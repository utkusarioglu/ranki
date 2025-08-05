import type {
  ApiStageParsed,
  ApiStageValidated,
  AstNodeDefinite,
} from "@ranki/package-api";
import {
  validationNodeLeaf,
  validationNodeParent,
} from "@ranki/package-api/helpers";

function recurse(root: AstNodeDefinite) {
  switch (root.kind) {
    case "leaf":
      return validationNodeLeaf(root, {});
    case "parent":
      const children = root.children.map((n) => recurse(n));
      const { kind, type, completion, parameters, configuration, attributes } =
        root;

      return validationNodeParent(
        {
          kind,
          type,
          completion,
          parameters,
          configuration,
          attributes,
        },
        {
          children,
        },
      );
  }
}

export function validate(parsed: ApiStageParsed): Promise<ApiStageValidated> {
  return Promise.resolve({
    ...parsed,
    stage: "validated",
    validated: recurse(parsed.ast),
  });
}
