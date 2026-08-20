import type { LitElement } from "lit";
import {
  ReconciliationController,
  type SubtreeParams,
} from "./reconciler.controller.mjs";
import { O11y } from "_controllers/geometry/o11y/o11y.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: SubtreeParams<Instance, S>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.log.debug("Created reconciler decorator", {
        varName: context.name,
        params,
      });
      return new ReconciliationController<Instance, S>(this, params);
    };
  };
}
