/**
 * Class sanitizer module for creating safe views of class instances.
 *
 * This module provides utilities to wrap class instances in a sanitized view
 * that catches exceptions when accessing properties or calling methods.
 *
 * @aidoc
 */

import { tryCatch } from "../../../utils/try-catch.mjs";
import type { ClassSanitizer } from "./sanitizer.types.mjs";

/**
 * Gets all method and property keys from an object, including inherited ones.
 * Excludes the 'constructor' key.
 *
 * @param obj - The object to extract keys from.
 * @returns An array of property keys.
 *
 * @aidoc
 */
function getAllMethodKeys(obj: object): PropertyKey[] {
  const keys = new Set<PropertyKey>();

  let cur = obj;
  while (cur && cur !== Object.prototype) {
    for (const k of Reflect.ownKeys(cur)) {
      if (k !== "constructor") keys.add(k);
    }
    cur = Object.getPrototypeOf(cur);
  }

  return [...keys];
}

/**
 * Wraps an object instance with try-catch protection for all its properties and methods.
 *
 * @template T - The type of the instance being wrapped.
 * @param instance - The original instance to wrap.
 * @param consume - A function that wraps property access or method calls with try-catch.
 * @returns A sanitized view of the instance.
 *
 * @aidoc
 */
function wrapWithTryCatch<T extends object>(
  instance: T,
  consume: <K extends PropertyKey>(key: K, value: any) => any,
): ClassSanitizer<T> {
  const out = Object.create(Object.getPrototypeOf(instance));

  for (const k of getAllMethodKeys(instance)) {
    const desc =
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(instance), k) ??
      Object.getOwnPropertyDescriptor(instance, k);

    if (!desc) continue;

    if (typeof desc.value === "function") {
      Object.defineProperty(out, k, {
        ...desc,
        value: (...args: any[]) =>
          consume(k, () => desc.value!.apply(instance, args)),
      });
    } else {
      Object.defineProperty(out, k, desc);
    }
  }

  return out;
}

/**
 * Creates a sanitized view of a class instance.
 *
 * All property accesses and method calls on the returned object will be
 * wrapped in try-catch blocks, returning TryCatch results instead of
 * throwing exceptions.
 *
 * @template C - The type of the class instance.
 * @param source - The original class instance to sanitize.
 * @returns A sanitized view of the instance with an 'original' property.
 *
 * @aidoc
 */
export function createSanitizedView<C extends object>(
  source: C,
): ClassSanitizer<C> {
  const sanitized = wrapWithTryCatch(source, tryCatch);

  return Object.assign(sanitized, {
    original: source,
  });
}
