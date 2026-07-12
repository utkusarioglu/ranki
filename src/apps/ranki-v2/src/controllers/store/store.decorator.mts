import type { AnkiStore } from "_store/app.mjs";
import type { ReactiveElement } from "lit";
import { type StoreAdapter, StoreController } from "./store.controller.mjs";

export function store<S, T = S>(
  selector: (s: AnkiStore) => S,
  adapter?: StoreAdapter<S, T>,
) {
  return (proto: ReactiveElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance: ReactiveElement) => {
      (instance as any)[key] = new StoreController(instance, selector, adapter);
    });
  };
}
