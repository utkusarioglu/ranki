import type {
  CreatorName,
  AstSourceString,
  IAstNode,
  AstSourceView,
} from "@dqm/package-dqm-api-v2";

export type SanitizedNode = Partial<{
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  subtree?: SanitizedNode[];
  children?: SanitizedNode[];
}>;

export function sanitizeSingle(
  astNode: IAstNode,
  features: string[],
): SanitizedNode {
  const children = astNode
    .getChildrenNodes()
    .map((n) => sanitizeSingle(n, features));
  const subtree = astNode
    .getSubtreeNodes()
    .map((n) => sanitizeSingle(n, features));
  const sanitized: SanitizedNode = {};

  features.forEach((feature) => {
    switch (feature) {
      case "creator":
        sanitized["creator"] = astNode.getCreator();
        break;
      case "idList":
        sanitized["idList"] = astNode
          .getCpx()!
          .getIdList()
          .map((v) => v.join("."))
          .join(" | ");
        break;
      case "children":
        if (children.length) {
          sanitized["children"] = children;
        }
        break;
      case "subtree":
        if (subtree.length) {
          sanitized["subtree"] = subtree;
        }
        break;
      case "source":
        sanitized["source"] =
          astNode.getKind() === "leaf"
            ? astNode.getLeafView()
            : {
                type: "string",
                raw: astNode.getSourceString(),
                value: astNode.getSourceString(),
              };
        break;
      default:
        throw new Error(`Unrecognized sanitize feature: ${feature}`);
    }
  });

  return sanitized;
}
