import type { ReactiveController, ReactiveControllerHost } from "lit";

import { type AnkiStore } from "_store/app/app.types.mjs";
import { store } from "_store/store.mjs";

export type StoreAdapter<S, T> = (curr: S, prev: T | undefined) => T;

export class StoreController<S, T = S> implements ReactiveController {
  curr!: T;
  prev: T | undefined;
  constructor(
    host: ReactiveControllerHost,
    selector: (s: AnkiStore) => S,
    adapter: StoreAdapter<S, T> = (v, _p) => v as unknown as T,
  ) {
    host.addController(this);

    this.unsubscribe = store.use.app.subscribe(selector, (v) => {
      this.prev = this.curr;
      this.curr = adapter(v, this.prev);
      host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe();
  }

  // DECIDE why is this here?
  private unsubscribe: () => void = () => {};
}
