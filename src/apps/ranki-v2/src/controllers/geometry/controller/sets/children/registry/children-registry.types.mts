import type { GeometryInteractions } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { EmitLifecycle as EmitLifecycle } from "_controllers/geometry/geometry-intent.types.mjs";
import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";

export interface EmittedComponentState {
  lifecycle: EmitLifecycle;
  interaction: GeometryInteractions;
  style?: WidthHeight;
}
