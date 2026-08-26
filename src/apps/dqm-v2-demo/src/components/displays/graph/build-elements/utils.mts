// import type { E, Flattened, N, TraversalNode } from "./build.types.mts";
import type { UniqueValue } from "@dqm/package-dqm-api-v2";
import type { TryCatch } from "@dqm/package-dqm-v2-debug";

export const cls = (...cls: any[]) => cls.filter((v) => !!v).join(" ");

// type TExtend<T> = null | {
//   getParent(): T | null;
// };

type GetRootReturn<T> = [root: null | T, climbs: number];

export function getRoot<T>(n: T, method: string): GetRootReturn<T> {
  let prev: null | T = n;
  let curr: null | T = n;
  let climbs = 1;
  while (curr !== null) {
    climbs--;
    prev = curr;
    // @ts-expect-error
    curr = curr[method]();
  }
  return [prev, climbs];
}

export function uniqueLabel(
  type: string,
  name: TryCatch<string>,
  unique: UniqueValue,
) {
  return [type, ":", name.value, " (", unique, ")"].join("");
}
