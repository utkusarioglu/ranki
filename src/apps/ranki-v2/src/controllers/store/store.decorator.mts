import type { AnkiStore } from "_store/app/app.types.mjs";
import type { ReactiveElement } from "lit";
import { type StoreAdapter, StoreController } from "./store.controller.mjs";
import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

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
      O11y.debug.log("Created store decorator", { context, selector, adapter });
      return new StoreController(this, selector, adapter);
    };
  };
}
