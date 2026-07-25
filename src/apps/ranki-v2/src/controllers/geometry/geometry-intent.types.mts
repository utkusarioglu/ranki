import type { EmitModes } from "./events/geometry-events.types.mts";

export type EmitIntent = "update" | "leave" | "enter" | "mode";

export type WithEmitIntent = { intent: EmitIntent };

export type WithEmitIntents = { intents: EmitIntent[] };

export type WithMode = { mode: EmitModes | undefined };

export type LocalAction =
  | "resize"
  | "none"
  | "enter"
  | "leave"
  | "move"
  | EmitModes;
