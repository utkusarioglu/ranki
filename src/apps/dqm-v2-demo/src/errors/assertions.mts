import type { TryCatch, TryCatchSuccess } from "../utils/utils.mts";
import {
  DqmDemoError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-demo-error.mts";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertExists(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined) {
    throw new DqmDemoError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertNever(extra: AssertionExtra): never {
  throw new DqmDemoError({
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
    throw new DqmDemoError({
      code: "TRY_CATCH_FAIL",
      cause: v.error,
      ...extra,
    });
  }
}
