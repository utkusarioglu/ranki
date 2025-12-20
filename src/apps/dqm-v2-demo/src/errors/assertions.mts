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
