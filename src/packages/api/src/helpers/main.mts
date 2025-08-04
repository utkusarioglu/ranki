import type { AstNode } from "../types/ast-node.mjs";

type AstNodeFuncRequired = "type";
type AstNodeFuncParams = Pick<AstNode, AstNodeFuncRequired> &
  Partial<Omit<AstNode, AstNodeFuncRequired>>;

export function astNode(specs: AstNodeFuncParams): AstNode {
  return {
    type: specs.type,
    ...(specs.warnings !== undefined && { warnings: specs.warnings }),
    ...(specs.configuration !== undefined && {
      configuration: specs.configuration,
    }),
    ...(specs.attributes !== undefined && { attributes: specs.attributes }),
    ...(specs.parameters !== undefined && { parameters: specs.parameters }),
    ...(specs.children !== undefined && { children: specs.children }),
    ...(specs.source !== undefined && { source: specs.source }),
    ...(specs.ohm !== undefined && { ohm: specs.ohm }),
  };
}
