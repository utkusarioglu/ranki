import type { GeometryEventTypes } from "../events/types/geometry-events.constructor.types.mjs";
import type { LitElement } from "lit";

import type { GetCollectionConstructorParam } from "../animator/types/animator.constructor.types.mjs";
import type { GeometryEventCb } from "../events/types/geometry-events.constructor.types.mjs";
import type { GeometrySetsConstructorParams } from "../sets/sets.types.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> extends GeometrySetsConstructorParams<Instance> {
  collection: GetCollectionConstructorParam<Instance>;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
  role: GeometryRole;
}

export type GeometryRole = { type?: "GeometryRole" } & string;
