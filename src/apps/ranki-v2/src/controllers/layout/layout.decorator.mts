import type { ReactiveElement } from "lit";
import { LayoutController } from "./layout.controller.mjs";
import type { LayoutParams } from "./layout.types.mjs";
import type { HostType } from "./layout.controller.types.mts";

export function layout<Instance extends HostType>(
  params: LayoutParams<Instance>,
) {
  return (proto: HostType, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new LayoutController<Instance>(
        instance as Instance,
        params,
      );
    });
  };
}
