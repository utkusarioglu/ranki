import { DqmError } from "./export.mjs";

export function assertNotExists<C extends {}>(
  value: C | undefined,
  obj: any,
): asserts value is undefined {
  if (value !== undefined) {
    throw new DqmError("VALUE_DEFINED", obj);
  }
}

export function assertExists(v: any, obj: any): asserts v is object {
  if (v === undefined) {
    throw new DqmError("VALUE_UNDEFINED", obj);
  }
}

export function assertArrayNotEmpty(
  this: any,
  a: any[],
  rest: Record<string, any>,
) {
  if (!a.length) {
    throw new DqmError("EMPTY_ARRAY", { obj: this, ...rest });
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

export function assertParent(self: any, obj: any) {
  if (self.kind === "leaf") {
    throw new DqmError("REQUIRES_PARENT", obj);
  }
}
