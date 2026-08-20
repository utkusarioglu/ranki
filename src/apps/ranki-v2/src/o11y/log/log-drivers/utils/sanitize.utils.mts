export function sanitize<T>(value: unknown, seen = new WeakSet<object>()): T {
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
    return value.map((item) => sanitize(item, seen)) as T;
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
    result[key] = sanitize(child, seen);
  }

  const sorted = Object.fromEntries(
    Object.entries(result).sort(([k1, v1], [k2, v2]) => {
      const isObj1 = typeof v1 === "object";
      const isObj2 = typeof v2 === "object";

      if (!isObj1 && !isObj2) {
        return k1.localeCompare(k2);
      } else if (isObj1 && !isObj2) {
        return 1;
      } else if (!isObj1 && isObj2) {
        return -1;
      } else {
        return JSON.stringify(v1).localeCompare(JSON.stringify(v2));
      }
    }),
  );

  return sorted as T;
}
