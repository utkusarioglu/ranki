import type {
  GeometryEventInteraction,
  GeometryInteractionEmit,
} from "./interaction.types.mjs";
import type {
  EmitLifecycleKey,
  GeometryEventLifecycle,
} from "./lifecycle.types.mjs";
import type { GeometryEventMode, GeometryEventModeKey } from "./mode.types.mjs";

export type EmitType = GeometryEvent["type"];

export type GeometryEvent =
  | GeometryEventInteraction
  | GeometryEventLifecycle
  | GeometryEventMode;

export type LocalAction =
  | EmitLifecycleKey
  | GeometryInteractionEmit
  | GeometryEventModeKey;
