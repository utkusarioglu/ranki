import type { EmitLifecycleKey as EmitLifecycleKey } from "_controllers/geometry/controller/events/types/lifecycle.types.mjs";
import type { WidthHeight } from "_controllers/geometry/controller/types/geometry-style.types.mjs";

export interface EmittedComponentState {
  interaction: GeometryInteraction;
  lifecycle: EmitLifecycleKey;
  style?: WidthHeight;
}

export interface GeometryInteraction {
  drag: GeometryInteractionState;
  focus: GeometryInteractionState;
  hover: GeometryInteractionState;
  press: GeometryInteractionState;
}

export type GeometryInteractionState = "end" | "none" | "start";
