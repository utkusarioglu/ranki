import type { LitElement, ReactiveElement } from "lit";
import { GeometryController } from "../controller/geometry-controller.mjs";
import type { GeometryDecoratorParams } from "./geometry-decorator.types.mjs";

export function geometry<Instance extends LitElement>(
  params: GeometryDecoratorParams<Instance>,
) {
  return (proto: LitElement, key: string) => {
    const ctor = proto.constructor as typeof ReactiveElement;

    ctor.addInitializer((instance) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any)[key] = new GeometryController<Instance>(
        instance as Instance,
        params,
      );
    });
  };
}
