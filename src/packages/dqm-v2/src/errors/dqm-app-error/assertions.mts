import {
  DqmAppError,
  type DqmPluginErrorConstructorParams,
} from "./dqm-app-error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details">;

export function assertNever(extra: AssertionExtra): never {
  throw new DqmAppError({
    code: "NEVER_EVENT",
    cause: null,
    ...extra,
  });
}
