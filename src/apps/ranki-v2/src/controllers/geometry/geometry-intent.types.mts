import type { EmitModes } from "./controller/events/geometry-events.types.mjs";

export type EmitLifecycle = "enter" | "leave" | "mode" | "none" | "update";

export type LocalAction =
  // | "enter"
  // | "leave"
  // | "move"
  // | "none"
  // | "update"
  // | "always"
  EmitLifecycle | EmitModes;

export type WithEmitIntent = { intent: EmitLifecycle };

export type WithEmitIntents = { intents: EmitLifecycle[] };

export type WithMode = { mode: EmitModes | undefined };
