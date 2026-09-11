import type { LitElement } from "lit";

import type { ReconcilerDecoratorParams } from "./reconciler-decorator.types.mjs";

import { ReconciliationController } from "../controller/reconciler-controller.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: ReconcilerDecoratorParams<Instance, S>,
) {
  return (
    _value: undefined,
    _context: ClassFieldDecoratorContext<Instance>,
  ) => {
    return function (this: Instance) {
      return new ReconciliationController<Instance, S>(this, params);
    };
  };
}

reconciler.emit = ReconciliationController.emit;
