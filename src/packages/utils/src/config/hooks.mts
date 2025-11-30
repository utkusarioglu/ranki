import { DqmError } from "../export.mjs";

export function assertExists<C extends {}>(
  value: C | undefined,
): asserts value is C {
  if (value === undefined) {
    throw new DqmError("VALUE_NOT_DEFINED", {});
  }
}
export function assertNotExists<C extends {}>(
  value: C | undefined,
): asserts value is undefined {
  if (value !== undefined) {
    throw new DqmError("VALUE_DEFINED", {});
  }
}
