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
