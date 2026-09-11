import type { store } from "_store/store.mjs";

export type StoreAdapter<S, T> = (curr: S, prev: T | undefined) => T;

export type StoreKey = keyof Stores;

export interface StoreParams<
  Key extends StoreKey,
  Selected,
  Adapted = Selected,
> {
  adapter?: StoreAdapter<Selected, Adapted>;
  key: Key;
  selector: (s: StoreState<Key>) => Selected;
}

export type StoreState<Key extends StoreKey> = ReturnType<
  Stores[Key]["getState"]
>;

type Stores = (typeof store)["use"];
