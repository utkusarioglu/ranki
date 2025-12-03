import type {
  CreatorName,
  AstSourceString,
  IAstNode,
  AstSourceView,
} from "@dqm/package-dqm-api-v2";

type Sanitized = {
  creator: CreatorName;
  source: AstSourceString | AstSourceView<any>;
  idList: string;
  subtree?: Sanitized[];
  CHILDREN?: Sanitized[];
};
export function sanitize(node: IAstNode): Sanitized {
  const children = node.getChildrenNodes().map((n) => sanitize(n));
  const subtree = node.getSubtreeNodes().map((n) => sanitize(n));
  // const subtree = subtreeNodes.reduce(
  //   (a, n, i) => (
  //     // @ts-ignore
  //     (a[i] = sanitize(n)), a
  //   ),
  //   {},
  // );
  const source =
    node.getKind() === "leaf" ? node.getLeafView() : node.getSourceString();

  return {
    creator: node.getCreator(),
    idList: node
      .getCpx()
      .getIdList()
      .map((v) => v.join("."))
      .join(" | "),
    source,
    ...(subtree.length ? { subtree } : {}),
    ...(children.length ? { CHILDREN: children } : {}),
  };
}
