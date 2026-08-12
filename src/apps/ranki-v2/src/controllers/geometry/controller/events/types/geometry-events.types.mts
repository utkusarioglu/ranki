import type {
  GeometryEventInteraction,
  GeometryInteractionEmit,
} from "./interaction.types.mjs";
import type {
  EmitLifecycleKey,
  GeometryEventLifecycle,
} from "./lifecycle.types.mjs";

export type EmitType = GeometryEvent["type"];

export type GeometryEvent = GeometryEventInteraction | GeometryEventLifecycle;

export type LocalAction = EmitLifecycleKey | GeometryInteractionEmit;
