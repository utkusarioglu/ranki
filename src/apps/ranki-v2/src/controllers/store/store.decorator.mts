import type { AnkiStore } from "_store/app/app.types.mjs";
import type { ReactiveElement } from "lit";

import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

import { AppStoreController, type StoreAdapter } from "./store.controller.mjs";

export function store<
  Instance extends ReactiveElement,
  StoreType,
  AdaptedType = StoreType,
>(
  selector: (s: AnkiStore) => StoreType,
  adapter?: StoreAdapter<StoreType, AdaptedType>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.devtools.log("Created store decorator", {
        adapter,
        context,
        selector,
      });
      return new AppStoreController(this, selector, adapter);
    };
  };
}
