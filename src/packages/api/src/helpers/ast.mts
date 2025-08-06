import type {
  AstNodeLeaf,
  AstNodeParentIndefinite,
  AstNodeUnparsed,
  AstNodeParentDefinite,
} from "../types/stages/ast.mjs";

type Params<Base, Required extends keyof Base> = Pick<Base, Required> &
  Partial<Omit<Base, "kind" | Required>>;

export function astNodeUnparsed(
  params: Params<AstNodeUnparsed, "ohm" | "type">,
): AstNodeUnparsed {
  return {
    kind: "unparsed",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    ohm: params.ohm,
  };
}

export function astNodeParentIndefinite(
  params: Params<AstNodeParentIndefinite, "children" | "type">,
): AstNodeParentIndefinite {
  return {
    kind: "parent",
    completion: "indefinite",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    children: params.children,
  };
}

export function astNodeParentDefinite(
  params: Params<AstNodeParentDefinite, "type" | "children">,
): AstNodeParentDefinite {
  return {
    kind: "parent",
    completion: "definite",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    children: params.children,
  };
}

export function astNodeLeaf(
  params: Params<AstNodeLeaf, "type" | "source">,
): AstNodeLeaf {
  return {
    kind: "leaf",
    type: params.type,
    configuration: params.configuration || [],
    attributes: params.attributes || [],
    parameters: params.parameters || [],
    source: params.source,
  };
}
