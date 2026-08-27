import type { LitElement } from "lit";

import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

import { ReconciliationController } from "./reconciler.controller.mjs";
import { type SubtreeParams } from "./reconciler.types.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: SubtreeParams<Instance, S>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.devtools.log("Created reconciler decorator", {
        context,
        params,
        self: this,
      });
      return new ReconciliationController<Instance, S>(this, params);
    };
  };
}
