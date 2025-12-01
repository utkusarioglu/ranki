import { Dqm } from "@dqm/package-dqm-v2";
import baseV2 from "@dqm/plugin-base-v2";
import yaml from "yaml";
import type {
  AstSourceString,
  CreatorName,
  IAstNode,
  NodeName,
} from "@dqm/package-dqm-api-v2";

type Sanitized = {
  creator: CreatorName;
  source: AstSourceString;
  subtree: Record<NodeName, Sanitized>;
  children?: Sanitized[];
};

function sanitize(node: IAstNode): Sanitized {
  const children = node.getChildrenNodes().map((n) => sanitize(n));
  const subtree = Object.entries(node.getSubtreeNodes()).reduce(
    (a, [k, v]) => ((a[k] = sanitize(v)), a),
    {} as Sanitized["subtree"],
  );

  return {
    creator: node.getCreator(),
    source: node.getSourceString(),
    subtree,
    ...(children.length ? { children } : {}),
  };
}

export function main() {
  const dqm = new Dqm({}, [baseV2]);
  try {
    const res = dqm.parse("hi world");
    const sanitized = sanitize(res);
    console.log(yaml.stringify(sanitized));
  } catch (e) {
    console.log((e as any).toString());
  }
}

main();
