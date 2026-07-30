import type { LitElement } from "lit";
import type { GeometryControllerConstructorParams } from "../controller/types/geometry-controller.constructor.types.mts";

export type GeometryDecoratorParams<Instance extends LitElement> =
  GeometryControllerConstructorParams<Instance>;
