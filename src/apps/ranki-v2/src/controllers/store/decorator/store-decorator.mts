import type { ReactiveElement } from "lit";

import { StoreController } from "../controller/store-controller.mjs";
import {
  type StoreAdapter,
  type StoreKey,
  type StoreState,
} from "../controller/store-controller.types.mjs";

export function store<
  Instance extends ReactiveElement,
  Key extends StoreKey,
  Selected = StoreState<Key>,
  Adapted = Selected,
>(
  key: Key,
  selector: (s: StoreState<Key>) => Selected,
  adapter?: StoreAdapter<Selected, Adapted>,
) {
  return (
    _value: undefined,
    _context: ClassFieldDecoratorContext<Instance>,
  ) => {
    return function (this: Instance) {
      return new StoreController(this, { adapter, key, selector });
    };
  };
}
