import {
  RankiAppError,
  type RankiAppErrorConstructorParams,
} from "./ranki-app-error.mjs";

type AssertionExtra = Partial<Pick<RankiAppErrorConstructorParams, "cause">> &
  Pick<RankiAppErrorConstructorParams, "details" | "why">;

export function assertArrayNotEmpty(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: any[],
  extra: AssertionExtra,
) {
  if (!a.length) {
    throw new RankiAppError({ cause: null, code: "ARRAY_EMPTY", ...extra });
  }
}

export function assertExists(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined || v === null) {
    throw new RankiAppError({
      cause: null,
      code: "VALUE_UNDEFINED",
      ...extra,
    });
  }
}

export function assertFalse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v: any,
  //
  extra: AssertionExtra,
): asserts v is false {
  if (v !== false) {
    throw new RankiAppError({
      cause: null,
      code: "VALUE_NOT_FALSE",
      ...extra,
    });
  }
}

export function assertNever(extra: AssertionExtra): never {
  throw new RankiAppError({
    cause: extra.cause || null,
    code: "NEVER_EVENT",
    ...extra,
  });
}

export function assertNotExists(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  extra: AssertionExtra,
): asserts value is undefined {
  if (value !== undefined) {
    throw new RankiAppError({
      cause: extra.cause || null,
      code: "VALUE_DEFINED",
      ...extra,
    });
  }
}

export function assertNotNull(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  //
  extra: AssertionExtra,
): asserts value is object {
  if (value === null) {
    throw new RankiAppError({
      cause: extra.cause || null,
      code: "VALUE_NULL",
      ...extra,
    });
  }
}

export function assertNotUndefined(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  //
  extra: AssertionExtra,
): asserts value is object {
  if (value === undefined) {
    throw new RankiAppError({
      cause: extra.cause || null,
      code: "VALUE_UNDEFINED",
      ...extra,
    });
  }
}

export function assertOverride(extra: AssertionExtra): never {
  throw new RankiAppError({
    cause: extra.cause || null,
    code: "OVERRIDE_REQUIRED",
    ...extra,
  });
}

export function assertTrue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  v: any,
  //
  extra: AssertionExtra,
): asserts v is true {
  if (v !== true) {
    throw new RankiAppError({
      cause: null,
      code: "VALUE_NOT_TRUE",
      ...extra,
    });
  }
}
