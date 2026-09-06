import type { ReactiveController, ReactiveControllerHost } from "lit";

import { store } from "_store/store.mjs";

export type StoreAdapter<S, T> = (curr: S, prev: T | undefined) => T;

export type StoreKey = keyof Stores;

export type StoreState<Key extends StoreKey> = ReturnType<
  Stores[Key]["getState"]
>;

type Stores = (typeof store)["use"];

export class StoreController<
  Key extends StoreKey,
  Selected,
  Adapted = Selected,
> implements ReactiveController {
  curr!: Adapted;
  prev: Adapted | undefined;

  /**
   * @dev
   * #1 Ts struggles with determining store types. it errs on `subscribe` method being different in every store.
   */
  constructor(
    host: ReactiveControllerHost,
    key: Key,
    selector: (s: StoreState<Key>) => Selected,
    adapter: StoreAdapter<Selected, Adapted> = (v, _p) =>
      v as unknown as Adapted,
  ) {
    host.addController(this);

    const selectedStore = store.use[key];
    this.unsubscribe = selectedStore
      // @ts-expect-error #1
      .subscribe(selector, (v) => {
        this.prev = this.curr;
        this.curr = adapter(v, this.prev);
        host.requestUpdate();
      });
  }

  hostDisconnected() {
    this.unsubscribe();
  }

  private unsubscribe: () => void = () => {};
}
