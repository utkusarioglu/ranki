import type { INTERACTION_SEPARATOR } from "../../sets/children/registry/children-registry.constants.mjs";

export interface GeometryEventMode {
  mode: string;
  type: "mode";
}

export type GeometryEventModeKey =
  `${string}${typeof INTERACTION_SEPARATOR}${ModeAnimationTypes}`;

export type ModeAnimationTypes = "enter" | "leave";
