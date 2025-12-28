import type { ConfigTypes } from "../config.types.mjs";
import {
  DqmConfigError,
  type DqmPluginErrorConstructorParams,
} from "./error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertNotIllegal(
  t: ConfigTypes,
  extra: Omit<AssertionExtra, "why">,
): asserts t is Exclude<ConfigTypes, "illegal"> {
  if (t === "illegal") {
    throw new DqmConfigError({
      code: "VALUE_ILLEGAL",
      cause: null,
      why: "Config cannot work with illegal values",
      ...extra,
    });
  }
}

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
