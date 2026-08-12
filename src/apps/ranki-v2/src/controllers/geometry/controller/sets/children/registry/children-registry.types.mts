import type { EmitLifecycle as EmitLifecycle } from "_controllers/geometry/geometry-intent.types.mjs";
import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";

export interface EmittedComponentState {
  interaction: GeometryInteraction;
  lifecycle: EmitLifecycle;
  style?: WidthHeight;
}

export interface GeometryInteraction {
  drag: GeometryInteractionState;
  focus: GeometryInteractionState;
  hover: GeometryInteractionState;
  press: GeometryInteractionState;
}

export type GeometryInteractionState = "end" | "none" | "start";
