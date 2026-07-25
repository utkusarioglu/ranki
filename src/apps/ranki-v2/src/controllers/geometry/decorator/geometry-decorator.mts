import type { LitElement, ReactiveElement } from "lit";
import { GeometryController } from "../controller/geometry-controller.mjs";
import type { GeometryDecoratorParams } from "./geometry-decorator.types.mts";

export function geometry<Instance extends LitElement>(
  params: GeometryDecoratorParams<Instance>,
) {
  return (proto: LitElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      (instance as any)[key] = new GeometryController<Instance>(
        instance as Instance,
        params,
      );
    });
  };
}
