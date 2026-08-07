import type { EmitModes } from "./controller/events/geometry-events.types.mjs";

export type EmitIntent = "enter" | "leave" | "mode" | "none" | "update";

export type LocalAction =
  | "enter"
  | "leave"
  | "move"
  | "none"
  | "resize"
  | "always"
  | EmitModes;

export type WithEmitIntent = { intent: EmitIntent };

export type WithEmitIntents = { intents: EmitIntent[] };

export type WithMode = { mode: EmitModes | undefined };
