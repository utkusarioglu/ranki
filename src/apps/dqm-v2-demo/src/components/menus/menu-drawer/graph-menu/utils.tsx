type ValueTuple = [string, (...any: any[]) => any];

export type Rows = ValueTuple[];

export function tryCatch(cb: () => any) {
  try {
    return cb();
  } catch (e) {
    return "(failed)";
  }
}
