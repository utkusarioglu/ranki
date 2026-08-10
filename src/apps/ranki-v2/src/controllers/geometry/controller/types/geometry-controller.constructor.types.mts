import type {
  GeometryEventCb,
  GeometryEventTypes,
} from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";

import type { GeometrySetsConstructorParams } from "../sets/sets.types.mjs";
import type { GetCollectionConstructorParam } from "../animator/animator.constructor.types.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> extends GeometrySetsConstructorParams<Instance> {
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
  role: GeometryRole;
  collection: GetCollectionConstructorParam<Instance>;
}

export type GeometryRole = { type?: "GeometryRole" } & string;
