import type { WidthHeight } from "../../geometry-style.types.mjs";

export type EmitType = "lifecycle" | "mode";

export type EmitModes = "hover-end" | "hover-start" | "idle";

export interface GeometryEventTypes {
  hover: boolean;
}

export type GeometryEvent = GeometryEventMode | GeometryEventLifecycle;

export type GeometryEventLifecycle =
  | GeometryEventLifecycleLeave
  | GeometryEventLifecycleConnected
  | GeometryEventLifecycleDisconnected
  | GeometryEventLifecycleUpdate;

interface GeometryEventLifecycleLeave {
  type: "lifecycle";
  lifecycle: "leave";
  mode?: EmitModes;
}

interface GeometryEventMode {
  type: "mode";
  mode: EmitModes;
}

interface GeometryEventLifecycleConnected {
  type: "lifecycle";
  lifecycle: "connected";
  mode?: EmitModes;
}

interface GeometryEventLifecycleDisconnected {
  type: "lifecycle";
  lifecycle: "disconnected";
  mode?: EmitModes;
}
interface GeometryEventLifecycleUpdate {
  type: "lifecycle";
  lifecycle: "update";
  mode?: EmitModes;
  style: WidthHeight;
}
