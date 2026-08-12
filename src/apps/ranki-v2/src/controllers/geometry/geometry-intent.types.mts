import type { GeometryInteractionEmit } from "./controller/events/geometry-events.types.mjs";

export type EmitLifecycle =
  | "enter"
  | "interaction"
  | "leave"
  | "none"
  | "update";

export type LocalAction = EmitLifecycle | GeometryInteractionEmit;

export type WithEmitIntent = { intent: EmitLifecycle };

export type WithEmitIntents = { intents: EmitLifecycle[] };

export type WithMode = { interaction: GeometryInteractionEmit | undefined };
