export function objectSorter(result: unknown): unknown {
  if (typeof result !== "object") return result;
  if (result === null) return null;
  return Object.fromEntries(
    Object.entries(result)
      .map(([k, v]) => [k, objectSorter(v)])
      .sort(([k1, v1], [k2, v2]) => {
        const isObj1 = typeof v1 === "object";
        const isObj2 = typeof v2 === "object";

        if (!isObj1 && !isObj2) {
          return (k1 as string).localeCompare(k2 as string);
        } else if (isObj1 && !isObj2) {
          return 1;
        } else if (!isObj1 && isObj2) {
          return -1;
        } else {
          return JSON.stringify(v1).localeCompare(JSON.stringify(v2));
        }
      }),
  );
}
