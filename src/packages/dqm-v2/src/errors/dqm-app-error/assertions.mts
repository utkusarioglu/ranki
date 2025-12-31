import {
  DqmAppError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-app-error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details"> &
  Partial<Pick<DqmPluginErrorConstructorParams, "cause">>;

export function assertNever(extra: AssertionExtra): never {
  throw new DqmAppError({
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
    throw new DqmAppError({
      code: "VALUE_DEFINED",
      cause: extra.cause || null,
      ...extra,
    });
  }
}
