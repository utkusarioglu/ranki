/**
 * Utility module for handling operations that may throw exceptions.
 *
 * This module provides types and functions to wrap potentially failing operations
 * in a safe container that captures both success and failure states.
 *
 * @aidoc
 */

/**
 * Represents a successful try-catch operation result.
 * @template T - The type of the successful result value.
 *
 * @dev
 * #1 Indicates the operation was successful.
 * #2 A key identifier for the operation, used for error tracking.
 * #3 The successful result value.
 *
 * @aidoc
 */
export type TryCatchSuccess<T> = {
  state: "success"; // #1
  key: Key; // #2
  value: T; // #3
};

/**
 * Represents a failed try-catch operation result.
 *
 * @dev
 * #1 Indicates the operation failed.
 * #2 A key identifier for the operation, used for error tracking.
 * #3 A placeholder value indicating failure.
 * #4 The error that was caught during the operation.
 *
 * @aidoc
 */
export type TryCatchFail = {
  state: "fail"; // #1
  key: Key; // #2
  value: "(failed)"; // #3
  error: unknown; // #4
};

/**
 * Type definition for keys used in try-catch operations.
 * Keys can be strings, numbers, or symbols for identifying operations.
 */
type Key = string | number | symbol;

/**
 * Union type representing either a successful or failed try-catch result.
 * @template T - The type of the expected successful result value.
 */
export type TryCatch<T> = TryCatchSuccess<T> | TryCatchFail;

/**
 * Wraps a callback function in a try-catch block and returns a TryCatch result.
 *
 * @template T - The return type of the callback function.
 * @param key - This is meant as an error id. can be removed if it doesn't deliver the expected use.
 * @param callback - The function to execute safely.
 * @returns A TryCatch result containing either the successful value or the caught error.
 *
 * @aidoc
 */
export function tryCatch<T>(key: Key, callback: () => T): TryCatch<T> {
  try {
    return {
      key,
      state: "success",
      value: callback() as T,
    };
  } catch (e) {
    return {
      state: "fail",
      value: "(failed)",
      key,
      error: e,
    };
  }
}

/**
 * Chains a try-catch operation on the result of a previous try-catch.
 * If the input is already a failure, returns it unchanged.
 * Otherwise, applies the callback to the successful value.
 *
 * @template T - The type of the input try-catch result.
 * @param o - The previous try-catch result to chain from.
 * @param cb - The callback to apply to the successful value.
 * @returns A new try-catch result from applying the callback, or the original failure.
 *
 * @aidoc
 */
export function tryCatchLeap<T>(o: TryCatch<T>, cb: (n: any) => any) {
  if (o.state === "fail") {
    return o;
  } else {
    return tryCatch("1", () => cb(o.value));
  }
}

/**
 * Maps an object type to a record where each property is wrapped in TryCatch.
 * @template T - The object type to map.
 */
export type TryCatchRecord<T extends object> = {
  [K in keyof T]: T[K] extends any ? TryCatch<T[K]> : never;
};

/**
 * Maps an object type to a record where each property is a function returning TryCatch.
 * @template T - The object type to map.
 */
export type TryCatchCall<T extends object> = {
  [K in keyof T]: () => TryCatch<T[K]>;
};
