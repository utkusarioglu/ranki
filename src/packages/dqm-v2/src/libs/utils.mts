import { DqmError } from "@ranki/package-utils";

export function assertExists(v: any, obj: any): asserts v is object {
  if (v === undefined) {
    throw new DqmError("VALUE_UNDEFINED", obj);
  }
}
