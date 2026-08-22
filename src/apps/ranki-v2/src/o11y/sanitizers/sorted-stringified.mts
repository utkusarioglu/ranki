export function basicRepresentation<T>(
  value: unknown,
  seen = new WeakSet<object>(),
): T {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") return `${value}n` as T;
    if (typeof value === "undefined") return "[undefined]" as T;
    if (typeof value === "function") {
      return `[Function ${value.name || "anonymous"}]` as T;
    }

    return value as T;
  }

  if (seen.has(value)) {
    return "[Circular]" as T;
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => basicRepresentation(item, seen)) as T;
  }

  if (value instanceof Error) {
    return {
      message: value.message,
      name: value.name,
      stack: value.stack,
    } as T;
  }

  const prototype = Object.getPrototypeOf(value);

  if (prototype !== Object.prototype && prototype !== null) {
    return `${value.constructor?.name ?? "Object"} {}` as T;
  }

  const result: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(value)) {
    result[key] = basicRepresentation(child, seen);
  }

  return result as T;
}
