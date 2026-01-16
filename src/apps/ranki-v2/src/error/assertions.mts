import {
  RankiAppError,
  type RankiAppErrorConstructorParams,
} from "./ranki-app-error.mjs";

type AssertionExtra = Pick<RankiAppErrorConstructorParams, "why" | "details"> &
  Partial<Pick<RankiAppErrorConstructorParams, "cause">>;

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

export function assertExists(
  value: any,
  extra: AssertionExtra,
): asserts value is object {
  if (value === undefined) {
    throw new RankiAppError({
      code: "VALUE_DEFINED",
      cause: extra.cause || null,
      ...extra,
    });
  }
}
