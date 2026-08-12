import type { INTERACTION_SEPARATOR } from "../../sets/children/registry/children-registry.constants.mjs";
import type {
  GeometryInteraction,
  GeometryInteractionState,
} from "../../sets/children/registry/children-registry.types.mjs";

export interface GeometryEventInteraction {
  interaction: GeometryInteractionEmit;
  type: "interaction";
}

export type GeometryInteractionEmit =
  `${keyof GeometryInteraction}${typeof INTERACTION_SEPARATOR}${GeometryInteractionState}`;
