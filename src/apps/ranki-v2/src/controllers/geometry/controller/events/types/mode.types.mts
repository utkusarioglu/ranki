import type { INTERACTION_SEPARATOR } from "../../sets/children/registry/children-registry.constants.mjs";

export interface GeometryEventMode {
  type: "mode";
  mode: string;
}

export type ModeAnimationTypes = "enter" | "leave";

export type GeometryEventModeKey =
  `${string}${typeof INTERACTION_SEPARATOR}${ModeAnimationTypes}`;
