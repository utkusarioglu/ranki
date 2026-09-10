import type { ReactiveController, ReactiveControllerHost } from "lit";

import { store } from "_store/store.mjs";

export type StoreAdapter<S, T> = (curr: S, prev: T | undefined) => T;

export type StoreKey = keyof Stores;

export type StoreState<Key extends StoreKey> = ReturnType<
  Stores[Key]["getState"]
>;

type Stores = (typeof store)["use"];

interface StoreParams<Key extends StoreKey, Selected, Adapted = Selected> {
  key: Key;
  selector: (s: StoreState<Key>) => Selected;
  adapter?: StoreAdapter<Selected, Adapted>;
}

export class StoreController<
  Key extends StoreKey,
  Selected,
  Adapted = Selected,
> implements ReactiveController {
  private curr!: Adapted;
  private prev: Adapted | undefined;

  /**
   * @dev
   * #1 Ts struggles with determining store types. it errs on `subscribe` method being different in every store.
   */
  constructor(
    host: ReactiveControllerHost,
    params: StoreParams<Key, Selected, Adapted>,
  ) {
    host.addController(this);
    if (params.adapter) {
      this.adapter = params.adapter;
    }

    const selectedStore = store.use[params.key];
    this.unsubscribe = selectedStore
      // @ts-expect-error #1
      .subscribe(
        //
        params.selector,
        // @ts-expect-error #1
        (v) => {
          this.prev = this.curr;
          this.curr = this.adapter(v, this.prev);
          host.requestUpdate();
        },
      );
  }

  hostDisconnected() {
    this.unsubscribe();
  }

  private unsubscribe: () => void = () => {};

  private adapter: StoreAdapter<Selected, Adapted> = (v, _p) =>
    v as unknown as Adapted;
}
