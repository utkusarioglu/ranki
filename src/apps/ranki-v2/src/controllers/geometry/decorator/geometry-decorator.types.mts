import type { LitElement } from "lit";

import type { GeometryControllerConstructorParams } from "../controller/types/geometry-controller.constructor.types.mjs";

export type GeometryDecoratorParams<Instance extends LitElement> =
  GeometryControllerConstructorParams<Instance>;
