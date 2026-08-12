import type { GeometryEventTypes } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";

import type { GetCollectionConstructorParam } from "../animator/animator.constructor.types.mjs";
import type { GeometryEventCb } from "../events/geometry-events.constructor.types.mjs";
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
