import type { TryCatch, TryCatchSuccess } from "../utils/try-catch.mjs";
import {
  DqmDebugError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-debug-error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertExists(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined) {
    throw new DqmDebugError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertNever(extra: AssertionExtra): never {
  throw new DqmDebugError({
    code: "NEVER_EVENT",
    cause: null,
    ...extra,
  });
}

export function assertTryCatchSuccess<T>(
  v: TryCatch<T>,
  extra: AssertionExtra,
): asserts v is TryCatchSuccess<T> {
  if (v.state === "fail") {
    throw new DqmDebugError({
      code: "TRY_CATCH_FAIL",
      cause: v.error,
      ...extra,
    });
  }
}
