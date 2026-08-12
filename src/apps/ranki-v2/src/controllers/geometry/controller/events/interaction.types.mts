import type {
  GeometryInteraction,
  GeometryInteractionState,
} from "../sets/children/registry/children-registry.types.mjs";

export interface GeometryEventInteraction {
  interaction: GeometryInteractionEmit;
  type: "interaction";
}

export type GeometryInteractionEmit =
  `${keyof GeometryInteraction}-${GeometryInteractionState}`;
