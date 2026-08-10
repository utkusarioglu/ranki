import type { WidthHeight } from "../../geometry-style.types.mjs";

export type EmitType = "lifecycle" | "interaction";

export type GeometryInteractions = "hover-end" | "hover-start" | "idle";

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
  interaction?: GeometryInteractions;
}

interface GeometryEventMode {
  type: "interaction";
  interaction: GeometryInteractions;
}

interface GeometryEventLifecycleConnected {
  type: "lifecycle";
  lifecycle: "connected";
  interaction?: GeometryInteractions;
}

interface GeometryEventLifecycleDisconnected {
  type: "lifecycle";
  lifecycle: "disconnected";
  interaction?: GeometryInteractions;
}
interface GeometryEventLifecycleUpdate {
  type: "lifecycle";
  lifecycle: "update";
  interaction?: GeometryInteractions;
  style: WidthHeight;
}
