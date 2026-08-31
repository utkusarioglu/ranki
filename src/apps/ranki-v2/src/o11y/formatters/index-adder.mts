let indexCounter = 0;

export function indexAdder(result: unknown): unknown {
  if (typeof result !== "object") return result;
  if (result === null) return result;
  if (Object.hasOwn(result, "index")) return result;
  return {
    ...result,
    index: indexCounter++,
  };
}
