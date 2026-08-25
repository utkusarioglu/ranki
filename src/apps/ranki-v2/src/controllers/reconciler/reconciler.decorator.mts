import type { LitElement } from "lit";

import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

import {
  ReconciliationController,
  type SubtreeParams,
} from "./reconciler.controller.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: SubtreeParams<Instance, S>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.debug.log("Created reconciler decorator", {
        context,
        params,
        self: this,
      });
      return new ReconciliationController<Instance, S>(this, params);
    };
  };
}
