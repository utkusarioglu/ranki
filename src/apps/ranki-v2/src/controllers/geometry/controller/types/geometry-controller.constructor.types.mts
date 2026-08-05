import type {
  GeometryEventCb,
  GeometryEventTypes,
} from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";
import type { GeometrySetsConstructorParams } from "../sets/sets.types.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> extends GeometrySetsConstructorParams<Instance> {
  role: GeometryRole;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
}

export type GeometryRole = string & { type?: "GeometryRole" };
