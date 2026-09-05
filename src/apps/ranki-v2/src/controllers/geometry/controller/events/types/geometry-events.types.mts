import type { Context } from "@opentelemetry/api";

import type { INTERACTION_SEPARATOR } from "../../sets/children/registry/children-registry.constants.mjs";
import type {
  GeometryEventInteraction,
  GeometryInteractionEmit,
} from "./interaction.types.mjs";
import type {
  EmitLifecycleKey,
  GeometryEventLifecycle,
} from "./lifecycle.types.mjs";
import type { GeometryEventMode, GeometryEventModeKey } from "./mode.types.mjs";
import type { R2C } from "_components/r2c/r2c.mjs";

export type EmitType = GeometryEvent["type"];

export interface EventWithContext<T> {
  context: Context;
  event: T;
}

export type GeometryEvent =
  | GeometryEventInteraction
  | GeometryEventLifecycle
  | GeometryEventMode;

export type LocalAction =
  | `interaction${typeof INTERACTION_SEPARATOR}${GeometryInteractionEmit}`
  | `lifecycle${typeof INTERACTION_SEPARATOR}${EmitLifecycleKey}`
  | `mode${typeof INTERACTION_SEPARATOR}${GeometryEventModeKey}`;

export type OnEmitCallbackParams = { detail: GeometryEvent; target: R2C };
