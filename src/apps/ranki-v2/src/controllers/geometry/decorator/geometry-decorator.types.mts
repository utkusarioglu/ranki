import type { GeometryControllerConstructorParams } from "../controller/geometry-decorator.constructor.types.mts";
import type { HostType } from "../geometry.types.mts";

export type GeometryDecoratorParams<Instance extends HostType> =
  GeometryControllerConstructorParams<Instance>;
