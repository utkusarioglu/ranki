import type { LitElement } from "lit";

import { ReconciliationController } from "./reconciler.controller.mjs";
import { type SubtreeParams } from "./reconciler.types.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: SubtreeParams<Instance, S>,
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
