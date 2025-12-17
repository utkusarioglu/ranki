import {
  DqmConfigError,
  type DqmPluginErrorConstructorParams,
} from "./error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertNotExists<C extends {}>(
  value: C | undefined,
  extra: AssertionExtra,
): asserts value is undefined {
  if (value !== undefined) {
    throw new DqmConfigError({
      code: "VALUE_DEFINED",
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
    throw new DqmConfigError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertArrayNotEmpty(arr: any[], extra: AssertionExtra) {
  if (!arr.length) {
    throw new DqmConfigError({
      code: "EMPTY_ARRAY",
      cause: null,
      ...extra,
    });
  }
}
