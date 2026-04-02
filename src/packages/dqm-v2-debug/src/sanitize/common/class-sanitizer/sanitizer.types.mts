import type { TryCatch } from "../../../utils/try-catch.mjs";

/**
 * Union type for class sanitizers. This is a utility type for handling
 * discriminated unions of class sanitizer types.
 * @template T - The type being sanitized.
 */
export type ClassSanitizerUnion<T> = T extends any ? ClassSanitizer<T> : never;
/**
 * A sanitized view of a class instance where all properties and methods
 * are wrapped to catch exceptions.
 *
 * Properties return TryCatch-wrapped values, and methods return functions
 * that return TryCatch-wrapped results.
 * @template T - The original class type being sanitized.
 *
 * @dev
 * #1 Reference to the original unsanitized instance.
 *
 * @aidoc
 */

export type ClassSanitizer<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => TryCatch<R>
    : TryCatch<T[K]>;
} & {
  original: T; // #1
};

/**
 * Represents a failed AST sanitization result.
 *
 * @dev
 * #1 Indicates the sanitization failed.
 * #2 The error message describing the failure.
 *
 * @aidoc
 */
export interface SanitizeFail {
  state: "fail"; // #1
  error: string; // #2
}

/**
 * Represents a successful sanitization result.
 *
 * @dev
 * #1 Indicates the sanitization was successful.
 * #2 The sanitized node data.
 *
 * @aidoc
 */
export interface SanitizeSuccess<T> {
  state: "success"; // #1
  data: T; // #2
}
