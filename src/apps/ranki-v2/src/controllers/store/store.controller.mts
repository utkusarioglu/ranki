import { appStore, type AnkiStore } from "_store/app.mjs";
import type { ReactiveController, ReactiveControllerHost } from "lit";

export type StoreAdapter<S, T> = (curr: S, prev: T | undefined) => T;

export class StoreController<S, T = S> implements ReactiveController {
  curr!: T;
  prev: T | undefined;
  private unsubscribe: () => void = () => {};

  constructor(
    host: ReactiveControllerHost,
    selector: (s: AnkiStore) => S,
    adapter: StoreAdapter<S, T> = (v, _p) => v as unknown as T,
  ) {
    host.addController(this);

    this.unsubscribe = appStore.subscribe(selector, (v) => {
      this.prev = this.curr;
      this.curr = adapter(v, this.prev);
      host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe();
  }
}
