import type { ReactiveElement } from "lit";
import { GeometryController } from "../controller/geometry.controller.mjs";
import type { GeometryParams, HostType } from "../geometry.types.mjs";

export function geometry<Instance extends HostType>(
  params: GeometryParams<Instance>,
) {
  return (proto: HostType, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new GeometryController<Instance>(
        instance as Instance,
        params,
      );
    });
  };
}
