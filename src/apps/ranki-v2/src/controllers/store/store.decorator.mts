import type { ReactiveElement } from "lit";

import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

import {
  type StoreAdapter,
  StoreController,
  type StoreKey,
  type StoreState,
} from "./store.controller.mjs";

export function store<
  Instance extends ReactiveElement,
  Key extends StoreKey,
  Selected = StoreState<Key>,
  Adapted = Selected,
>(
  key: Key,
  selector: (s: StoreState<Key>) => Selected,
  // selector: (s: AnkiStore) => StoreType,
  adapter?: StoreAdapter<Selected, Adapted>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.devtools.log("Created store decorator", {
        adapter,
        context,
        selector,
      });
      return new StoreController(this, key, selector, adapter);
    };
  };
}
