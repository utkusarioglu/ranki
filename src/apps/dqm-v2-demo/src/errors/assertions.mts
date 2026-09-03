import type { TryCatch, TryCatchSuccess } from "@dqm/package-dqm-v2-debug";

import {
  DqmDemoError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-demo-error.mts";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "details" | "why">;

export function assertNotUndefined(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined) {
    throw new DqmDemoError({
      cause: null,
      code: "VALUE_UNDEFINED",
      ...extra,
    });
  }
}

export function assertNotNull(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === null) {
    throw new DqmDemoError({
      cause: null,
      code: "VALUE_NULL",
      ...extra,
    });
  }
}

export function assertNever(extra: AssertionExtra): never {
  throw new DqmDemoError({
    cause: null,
    code: "NEVER_EVENT",
    ...extra,
  });
}

export function assertTryCatchSuccess<T>(
  v: TryCatch<T>,
  extra: AssertionExtra,
): asserts v is TryCatchSuccess<T> {
  if (v.state === "fail") {
    throw new DqmDemoError({
      cause: v.error,
      code: "TRY_CATCH_FAIL",
      ...extra,
    });
  }
}
