export interface ReconcilableSubtree<T> {
  diff: ReconciliationDiff;
  epoch: number;
  list: ReconciliationContainer<T>[];
}

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
