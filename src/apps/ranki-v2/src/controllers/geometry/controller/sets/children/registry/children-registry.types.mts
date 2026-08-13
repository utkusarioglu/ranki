import type { ModeLibraryKey } from "_controllers/geometry/controller/animator/types/library.types.mjs";
import type { EmitLifecycleKey as EmitLifecycleKey } from "_controllers/geometry/controller/events/types/lifecycle.types.mjs";
import type { WidthHeight } from "_controllers/geometry/controller/types/geometry-style.types.mjs";

export interface EmittedComponentState {
  interaction: GeometryInteraction;
  lifecycle: EmitLifecycleKey;
  mode: ModeLibraryKey;
  style?: WidthHeight;
}

export interface GeometryInteraction {
  drag: GeometryInteractionState;
  focus: GeometryInteractionState;
  hover: GeometryInteractionState;
  press: GeometryInteractionState;
}

export type GeometryInteractionKey = keyof GeometryInteraction;

export type GeometryInteractionLibraryState = "enter" | "leave";

export type GeometryInteractionState = "none" | GeometryInteractionLibraryState;
