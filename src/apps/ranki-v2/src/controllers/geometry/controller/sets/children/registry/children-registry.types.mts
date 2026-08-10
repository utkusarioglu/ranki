import type { EmitLifecycle as EmitLifecycle } from "_controllers/geometry/geometry-intent.types.mjs";
import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";

export type GeometryInteractionState = "start" | "end" | "none";

export interface GeometryInteraction {
  hover: GeometryInteractionState;
  drag: GeometryInteractionState;
  press: GeometryInteractionState;
  focus: GeometryInteractionState;
}

export interface EmittedComponentState {
  lifecycle: EmitLifecycle;
  interaction: GeometryInteraction;
  style?: WidthHeight;
}
