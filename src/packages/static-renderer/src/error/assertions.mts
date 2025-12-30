import {
  DqmRendererError,
  type DqmPluginErrorConstructorParams,
} from "./static-renderer-error.mjs";

type AssertionExtra = Pick<DqmPluginErrorConstructorParams, "why" | "details"> &
  Partial<Pick<DqmPluginErrorConstructorParams, "cause">>;

export function assertNever(extra: AssertionExtra): never {
  throw new DqmRendererError({
    code: "NEVER_EVENT",
    cause: extra.cause || null,
    ...extra,
  });
}
export function assertExists(
  v: any,
  extra: AssertionExtra,
): asserts v is object {
  if (v === undefined) {
    throw new DqmRendererError({
      code: "VALUE_UNDEFINED",
      cause: null,
      ...extra,
    });
  }
}
