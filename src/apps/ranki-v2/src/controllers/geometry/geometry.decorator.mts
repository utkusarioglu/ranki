import type { ReactiveElement } from "lit";
import { GeometryController } from "./geometry.mts";
import type { GeometryParams, HostType } from "./geometry.types.mts";

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
