import type {
  CreatorName,
  AstSourceString,
  IAstNode,
  AstSourceView,
} from "@dqm/package-dqm-api-v2";

type Sanitized = Partial<{
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  subtree?: Sanitized[];
  children?: Sanitized[];
}>;

export type SanitizationFeature =
  | "creator"
  | "idList"
  | "subtree"
  | "children"
  | "source";

export function sanitize(node: IAstNode, features: string[]): Sanitized {
  const children = node.getChildrenNodes().map((n) => sanitize(n, features));
  const subtree = node.getSubtreeNodes().map((n) => sanitize(n, features));
  const sanitized: Sanitized = {};

  features.forEach((feature) => {
    switch (feature) {
      case "creator":
        sanitized["creator"] = node.getCreator();
        break;
      case "idList":
        sanitized["idList"] = node
          .getCpx()
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
          node.getKind() === "leaf"
            ? node.getLeafView()
            : {
                type: "string",
                raw: node.getSourceString(),
              };
        break;
      default:
        throw new Error(`Unrecognized sanitize feature: ${feature}`);
    }
  });

  return sanitized;
}
