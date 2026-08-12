import type { WidthHeight } from "../../types/geometry-style.types.mjs";

/**
 * Value "enter" is used when an "update" is made on an object that doesn't yet exist.
 * !FIX "none" is now an escape hatch for situations where a child cannot be found but a placeholder is needed. I believe this is a conceptual flaw.
 */
export type EmitLifecycleInterpreted = "enter" | "none";

export type EmitLifecycleKey =
  | EmitLifecycleInterpreted
  | GeometryEventLifecycle["lifecycle"];

export type GeometryEventLifecycle =
  | GeometryEventLifecycleConnected
  | GeometryEventLifecycleDisconnected
  | GeometryEventLifecycleLeave
  | GeometryEventLifecycleUpdate;

interface GeometryEventLifecycleConnected {
  lifecycle: "connected";
  type: "lifecycle";
}

interface GeometryEventLifecycleDisconnected {
  lifecycle: "disconnected";
  type: "lifecycle";
}

interface GeometryEventLifecycleLeave {
  lifecycle: "leave";
  type: "lifecycle";
}

interface GeometryEventLifecycleUpdate {
  lifecycle: "update";
  style: WidthHeight;
  type: "lifecycle";
}
