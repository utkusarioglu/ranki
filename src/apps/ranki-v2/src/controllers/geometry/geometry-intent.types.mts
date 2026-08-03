import type { EmitModes } from "./controller/events/geometry-events.types.mjs";

export type EmitIntent = "update" | "leave" | "enter" | "mode" | "none";

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
