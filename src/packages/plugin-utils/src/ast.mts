import type * as ohm from "ohm-js";

import type { IAstNode, IAstNodeContext } from "@dqm/package-dqm-api-v2";
import { grabAssertExists } from "./assertions.mjs";

export function grabAst(self: ohm.Node): IAstNode {
  return self.args.context.ast;
}

export function buildContext(self: ohm.Node): IAstNodeContext {
  return self.args.context;
}

export function grabConstant<T>(self: ohm.Node, constantCode: string): T {
  const val = self.args.context.constants[constantCode];
  grabAssertExists(
    self,
    "ASSERT_EXISTS",
    `Required constant ${constantCode} is absent`,
    {},
  );
  return val as T;
}
