import type {
  CreatorName,
  AstSourceString,
  IAstNode,
  AstSourceView,
} from "@dqm/package-dqm-api-v2";

type Sanitized = {
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  subtree?: Sanitized[];
  children?: Sanitized[];
};
export function sanitize(node: IAstNode): Sanitized {
  const children = node.getChildrenNodes().map((n) => sanitize(n));
  const subtree = node.getSubtreeNodes().map((n) => sanitize(n));
  const source =
    node.getKind() === "leaf" ? node.getSourceView() : node.getSourceString();

  return {
    creator: node.getCreator(),
    source,
    ...(subtree.length ? { subtree } : {}),
    ...(children.length ? { children } : {}),
  };
}
