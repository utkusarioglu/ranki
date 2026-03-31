import { tryCatch, type TryCatch } from "../../../utils/try-catch.mjs";

// ANKI
export type ClassSanitizerUnion<T> = T extends any ? ClassSanitizer<T> : never;

// ANKI
export type ClassSanitizer<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R
    ? (...args: A) => TryCatch<R>
    : TryCatch<T[K]>;
} & {
  original: T;
};

// ANKI
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

// ANKI
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

export function createSanitizedView<C extends object>(
  source: C,
): ClassSanitizer<C> {
  const sanitized = wrapWithTryCatch(source, tryCatch);

  return Object.assign(sanitized, {
    original: source,
  });
}
