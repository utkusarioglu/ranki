import {
  RankiAppError,
  type RankiAppErrorConstructorParams,
} from "./ranki-app-error.mjs";

type AssertionExtra = Pick<RankiAppErrorConstructorParams, "why" | "details"> &
  Partial<Pick<RankiAppErrorConstructorParams, "cause">>;

export function assertOverride(extra: AssertionExtra): never {
  throw new RankiAppError({
    code: "OVERRIDE_REQUIRED",
    cause: extra.cause || null,
    ...extra,
  });
}

export function assertExists(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined || v === null) {
    throw new RankiAppError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}

export function assertNever(extra: AssertionExtra): never {
  throw new RankiAppError({
    code: "NEVER_EVENT",
    cause: extra.cause || null,
    ...extra,
  });
}

export function assertNotExists(
  value: any,
  extra: AssertionExtra,
): asserts value is undefined {
  if (value !== undefined) {
    throw new RankiAppError({
      code: "VALUE_DEFINED",
      cause: extra.cause || null,
      ...extra,
    });
  }
}

export function assertNotUndefined(
  value: any,
  extra: AssertionExtra,
): asserts value is object {
  if (value === undefined) {
    throw new RankiAppError({
      code: "VALUE_UNDEFINED",
      cause: extra.cause || null,
      ...extra,
    });
  }
}

export function assertNotNull(
  value: any,
  extra: AssertionExtra,
): asserts value is object {
  if (value === null) {
    throw new RankiAppError({
      code: "VALUE_NULL",
      cause: extra.cause || null,
      ...extra,
    });
  }
}

export function assertArrayNotEmpty(a: any[], extra: AssertionExtra) {
  if (!a.length) {
    throw new RankiAppError({ code: "ARRAY_EMPTY", cause: null, ...extra });
  }
}
