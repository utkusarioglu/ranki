import type * as ohm from "ohm-js";

import { assertExists } from "./assertions.mjs";
import type {
  IDqmPluginErrorCode,
  IDqmErrorDetails,
  IAstNode,
  IAstNodeContext,
  IDqmPluginError,
} from "@dqm/package-dqm-api-v2";

export function grabAst(self: ohm.Node): IAstNode {
  return self.args.context.ast;
}

export function buildContext(self: ohm.Node): IAstNodeContext {
  return self.args.context;
}

export function grabConstant<T>(self: ohm.Node, constantCode: string): T {
  const val = self.args.context.constants[constantCode];
  assertExists(val, {
    why: "Requested nonexistent constant code",
    constantCode,
  });
  return val as T;
}

export function grabError(
  self: ohm.Node,
  code: IDqmPluginErrorCode,
  why: string,
  details?: IDqmErrorDetails,
): IDqmPluginError {
  return self.args.context.callbacks.error(code, why, details);
}

export function grabAssertExists<T>(
  self: ohm.Node,
  value: T,
  why: string,
  details?: IDqmErrorDetails,
): asserts value is NonNullable<T> {
  if (value === undefined) {
    throw grabError(self, "ASSERT_EXISTS", why, {
      value,
      ...details,
    });
  }
}
