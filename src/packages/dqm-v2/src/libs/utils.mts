import { DqmError } from "@ranki/package-utils";

export function assertExists(v: any, key: string): asserts v is object {
  if (v === undefined) {
    throw new DqmError("VALUE_UNDEFINED", { key });
  }
}
