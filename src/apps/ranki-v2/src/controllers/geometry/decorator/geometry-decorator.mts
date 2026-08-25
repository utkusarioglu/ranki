import type { LitElement } from "lit";

import type { GeometryDecoratorParams } from "./geometry-decorator.types.mjs";

import { GeometryController } from "../controller/geometry-controller.mjs";
import { O11y } from "../o11y/o11y.mjs";

export function geometry<Instance extends LitElement>(
  params: GeometryDecoratorParams<Instance>,
) {
  return (_value: undefined, context: ClassFieldDecoratorContext<Instance>) => {
    return function (this: Instance) {
      O11y.debug.log("Created geometry decorator", {
        context,
        params,
        self: this,
      });

      return new GeometryController<Instance>(this, params);
    };
  };
}

geometry.configure = GeometryController.configure;
