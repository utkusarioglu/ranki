import { DqmConfigError } from "./error/error.mjs";
import type { LocalConfig, ConfigTypes } from "./config.types.mjs";

const TUPLE_SKIP = "_";

export class TypeEngine {
  static determineType(curr: LocalConfig): ConfigTypes {
    const t = typeof curr;
    if (curr === undefined) {
      return "undefined";
    } else if (["function", "symbol"].includes(t)) {
      return "illegal";
    } else if (curr === null) {
      return "null";
    } else if (["string", "number", "boolean", "bigint"].includes(t)) {
      return t as ConfigTypes;
    } else {
      if (Array.isArray(curr)) {
        if (curr.length === 0) {
          return "array-empty";
        } else if (curr.length === 1) {
          return "array-scalar";
        } else {
          const first = curr[0];
          if (curr.slice(1).some((v) => typeof v !== typeof first)) {
            return "tuple";
          } else {
            return "array-populated";
          }
        }
      } else if (t === "object") {
        if (Object.keys(t).length === 0) {
          return "kv-empty";
        } else {
          return "kv-populated";
        }
      }
    }
    throw new DqmConfigError({
      code: "UNRESOLVED_TYPE",
      cause: null,
      why: "Given value does not coincide with any of the type buckets",
      details: { curr, t },
    });
  }

  static determineConsistency(
    base: any,
    baseType: Exclude<ConfigTypes, "illegal">,
    curr: any,
    currType: Exclude<ConfigTypes, "illegal">,
  ): boolean {
    if (currType === "tuple" && baseType === "tuple") {
      if (curr.length !== base.length) {
        return false;
      }
      const baseTypes = base.map((v: any) => typeof v);
      const currTypes = curr.map((v: any, i: number) =>
        v === TUPLE_SKIP ? typeof base[i] : typeof v,
      );
      if ([baseTypes, currTypes].some(([b, c], i) => b[i] !== c[i])) {
        return false;
      }
      return true;
    } else if (currType !== baseType) {
      const arrayScalar =
        currType === "array-scalar" &&
        ["string", "number", "boolean"].includes(baseType);
      const arrays =
        currType.startsWith("array") && baseType.startsWith("array");
      const kvs = currType.startsWith("kv") && baseType.startsWith("kv");
      const skip = currType === "undefined";
      const revert = currType === "null";

      if (!arrays && !kvs && !revert && !skip && !arrayScalar) {
        return false;
      }
    }
    return true;
  }
}
