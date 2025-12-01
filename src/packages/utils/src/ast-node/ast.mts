import type * as ohm from "ohm-js";
import type { IAstNode } from "@dqm/package-dqm-api-v2";

export function getAst(self: ohm.Node): IAstNode {
  return self.args.context.ast;
}
