/**
 * Assertion utilities for runtime checks.
 *
 * This module provides assertion functions that throw specific debug errors
 * when certain conditions are not met, helping with debugging and error handling.
 *
 * @aidoc
 */

import type { TryCatch, TryCatchSuccess } from "../utils/try-catch.mjs";
import {
  DqmDebugError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-debug-error.mjs";

/**
 * Extra parameters for assertion functions, including error context.
 */
type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

/**
 * Asserts that a value is not undefined.
 * Throws a VALUE_UNDEFINED error if the value is undefined.
 *
 * @param v - The value to check.
 * @param extra - Additional context for the error.
 * @throws {DqmDebugError} If the value is undefined.
 *
 * @aidoc
 */
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

/**
 * Asserts that a TryCatch result is successful.
 * Throws a TRY_CATCH_FAIL error if the result indicates failure.
 *
 * @template T - The type of the successful value.
 * @param v - The TryCatch result to check.
 * @param extra - Additional context for the error.
 * @throws {DqmDebugError} If the TryCatch result is a failure.
 *
 * @aidoc
 */
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
