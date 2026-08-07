import type { EmitModes } from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { EmitIntent } from "_controllers/geometry/geometry-intent.types.mjs";
import type { WidthHeight } from "_controllers/geometry/geometry-style.types.mjs";

export interface EmittedComponentState {
  intent: EmitIntent;
  mode: EmitModes;
  style?: WidthHeight;
}
