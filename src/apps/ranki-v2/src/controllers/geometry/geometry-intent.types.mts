import type { GeometryInteractions } from "./controller/events/geometry-events.types.mjs";

export type EmitLifecycle =
  | "enter"
  | "leave"
  | "interaction"
  | "none"
  | "update";

export type LocalAction =
  // | "enter"
  // | "leave"
  // | "move"
  // | "none"
  // | "update"
  // | "always"
  EmitLifecycle | GeometryInteractions;

export type WithEmitIntent = { intent: EmitLifecycle };

export type WithEmitIntents = { intents: EmitLifecycle[] };

export type WithMode = { interaction: GeometryInteractions | undefined };
