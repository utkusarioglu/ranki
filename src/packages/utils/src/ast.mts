import type * as ohm from "ohm-js";
import type { IAstNode, IAstNodeContext } from "@dqm/package-dqm-api-v2";

export function grabAst(self: ohm.Node): IAstNode {
  return self.args.context.ast;
}

export function buildContext(self: ohm.Node): IAstNodeContext {
  return self.args.context;
}
