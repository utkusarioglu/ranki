import type { TryCatch } from "_utils/utils.mjs";
import type { E, Flattened, N, TraversalNode } from "./build.types.mts";
import type { UniqueValue } from "@dqm/package-dqm-api-v2";

export const cls = (...cls: any[]) => cls.filter((v) => !!v).join(" ");

// type TExtend<T> = null | {
//   getParent(): T | null;
// };

type GetRootReturn<T> = [root: T | null, climbs: number];

export function getRoot<T>(n: T, method: string): GetRootReturn<T> {
  let prev: T | null = n;
  let curr: T | null = n;
  let climbs = 1;
  while (curr !== null) {
    climbs--;
    prev = curr;
    // @ts-expect-error
    curr = curr[method]();
  }
  return [prev, climbs];
}

export function flatten(a: TraversalNode[]): Flattened {
  const nodes: (N | E)[] = [];

  a.forEach((t) => {
    Object.values(t.relations)
      .map((n) => flatten(n))
      .forEach((n) => nodes.push(...n));

    if (t.node) nodes.push(t.node);
    Object.values(t.edges).forEach((e) => nodes.push(...e));
  });

  return nodes;
}

export function uniqueLabel(
  type: string,
  name: TryCatch<string>,
  unique: UniqueValue,
) {
  return [type, ":", name.value, " (", unique, ")"].join("");
}
