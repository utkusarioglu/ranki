import {
  DqmUtilError,
  type DqmPluginErrorConstructorParams,
} from "./util-error/util-error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertNotUndefined<C extends {}>(
  value: C | undefined,
  extra: AssertionExtra,
  // obj: any,
): asserts value is undefined {
  if (value !== undefined) {
    throw new DqmUtilError({
      code: "VALUE_DEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertNull<C extends {}>(
  value: C | null,
  extra: AssertionExtra,
  // obj: any,
): asserts value is null {
  if (value !== null) {
    throw new DqmUtilError({
      code: "VALUE_NOT_NULL",
      cause: null,
      ...extra,
    });
  }
}

export function assertExists(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined) {
    throw new DqmUtilError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertSetEmpty(a: Set<any>, extra: AssertionExtra) {
  if (a.size) {
    throw new DqmUtilError({ code: "SET_NOT_EMPTY", cause: null, ...extra });
  }
}

export function assertArrayNotEmpty(a: any[], extra: AssertionExtra) {
  if (!a.length) {
    throw new DqmUtilError({ code: "ARRAY_EMPTY", cause: null, ...extra });
  }
}

export function assertArrayEmpty(a: any[], extra: AssertionExtra) {
  if (a.length) {
    throw new DqmUtilError({
      code: "ARRAY_NOT_EMPTY",
      cause: null,
      why: extra.why,
      details: {
        array: a,
        ...extra.details,
      },
    });
  }
}

export function assertMethodContext<T extends { kind: string }>(
  context: T,
  // obj: any,
  extra: AssertionExtra,
): asserts context is any {
  if (context.kind !== "method") {
    throw new DqmUtilError({
      code: "METHOD_DECORATOR_ON_WRONG_CONTEXT",
      cause: null,
      ...extra,
    });
  }
}

export function assertParent(
  self: { getKind: () => string },
  extra: AssertionExtra,
) {
  if (self.getKind() !== "parent") {
    throw new DqmUtilError({
      code: "REQUIRES_PARENT",
      cause: null,
      ...extra,
    });
  }
}

export function assertLeaf(
  self: { getKind: () => string },
  extra: AssertionExtra,
) {
  if (self.getKind() !== "leaf") {
    throw new DqmUtilError({
      code: "REQUIRES_LEAF",
      cause: null,
      ...extra,
    });
  }
}
