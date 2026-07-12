import type { LitElement, ReactiveElement } from "lit";
import {
  ReconciliationController,
  type SubtreeParams,
} from "./reconciler.controller.mjs";

export function reconciler<Instance extends LitElement, S>(
  params: SubtreeParams<Instance, S>,
) {
  return (proto: ReactiveElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new ReconciliationController<Instance, S>(
        instance as Instance,
        params,
      );
    });
  };
}
