import { DqmError } from "@dqm/package-utils";

export function assertExists(v: any, obj: any): asserts v is object {
  if (v === undefined) {
    throw new DqmError("VALUE_UNDEFINED", obj);
  }
}

export function assertMethodContext<T extends { kind: string }>(
  context: T,
  obj: any,
): asserts context is any {
  if (context.kind !== "method") {
    throw new DqmError("METHOD_DECORATOR_ON_WRONG_CONTEXT", {
      context,
      ...obj,
    });
  }
}
