import { appStore, type AnkiStore } from "_store/app.mjs";
import type { ReactiveController, ReactiveControllerHost } from "lit";

export class StoreController<S> implements ReactiveController {
  value!: S;
  private unsubscribe: () => void = () => {};

  constructor(host: ReactiveControllerHost, selector: (s: AnkiStore) => S) {
    host.addController(this);

    this.unsubscribe = appStore.subscribe(selector, (v) => {
      this.value = v;
      host.requestUpdate();
    });
  }

  hostDisconnected() {
    this.unsubscribe();
  }
}
