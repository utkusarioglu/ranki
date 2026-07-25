import type { LitElement } from "lit";
import type { GeometryControllerConstructorParams } from "../controller/geometry-decorator.constructor.types.mts";

export type GeometryDecoratorParams<Instance extends LitElement> =
  GeometryControllerConstructorParams<Instance>;
