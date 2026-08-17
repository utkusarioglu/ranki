function serialize(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null || typeof value !== "object") {
    if (typeof value === "bigint") return `${value}n`;
    if (typeof value === "undefined") return "[undefined]";
    if (typeof value === "function") {
      return `[Function ${value.name || "anonymous"}]`;
    }

    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => serialize(item, seen));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  const prototype = Object.getPrototypeOf(value);

  if (prototype !== Object.prototype && prototype !== null) {
    return `${value.constructor?.name ?? "Object"} {}`;
  }

  const result: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(value)) {
    result[key] = serialize(child, seen);
  }

  return result;
}

export function safeStringify(value: unknown): string {
  return JSON.stringify(serialize(value));
}
