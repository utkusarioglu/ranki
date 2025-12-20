import type { E, Flattened, N, TraversalNode } from "./build.types";

export const classes = (...cls: any[]) => cls.filter((v) => !!v).join(" ");

type TExtend<T> = null | {
  getParent(): T | null;
};

type GetRootReturn<T> = [root: T | null, climbs: number];

export function getRoot<T extends TExtend<T>>(n: T): GetRootReturn<T> {
  let prev: T | null = n;
  let curr: T | null = n;
  let climbs = 1;
  while (curr !== null) {
    climbs--;
    prev = curr;
    curr = curr.getParent();
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
