export type R2ReconcilerEmit = {
  type: "leave";
};

export interface ReconcilableSubtree<T> {
  diff: ReconciliationDiff;
  epoch: number;
  list: ReconciliationContainer<T>[];
}

export interface ReconcilableType {
  leave: boolean;
}

export type ReconcileSingle<G> = (curr: G, prev: G) => ReconciliationActions;

export type ReconciliationActions = "add" | "remove" | "retain" | "update";

export interface ReconciliationContainer<T> {
  id: number;
  leave: boolean;
  props: T;
}

export type ReconciliationDiff = {
  add: number[];
  remove: number[];
  retain: number[];
  stagger: {
    first: number;
    indices: number[];
  };
  update: number[];
};
