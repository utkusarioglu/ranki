import type { WidthHeight } from "../../geometry-style.types.mjs";
import type {
  GeometryInteraction,
  GeometryInteractionState,
} from "../sets/children/registry/children-registry.types.mjs";

export type EmitType = "lifecycle" | "interaction";

export type GeometryInteractionEmit =
  `${keyof GeometryInteraction}-${GeometryInteractionState}`;

export interface GeometryEventTypes {
  hover: boolean;
}

export type GeometryEvent = GeometryEventInteraction | GeometryEventLifecycle;

export type GeometryEventLifecycle =
  | GeometryEventLifecycleLeave
  | GeometryEventLifecycleConnected
  | GeometryEventLifecycleDisconnected
  | GeometryEventLifecycleUpdate;

interface GeometryEventLifecycleLeave {
  type: "lifecycle";
  lifecycle: "leave";
  // interaction?: GeometryInteractionEmit;
}

export interface GeometryEventInteraction {
  type: "interaction";
  interaction: GeometryInteractionEmit;
}

interface GeometryEventLifecycleConnected {
  type: "lifecycle";
  lifecycle: "connected";
  // interaction?: GeometryInteractionEmit;
}

interface GeometryEventLifecycleDisconnected {
  type: "lifecycle";
  lifecycle: "disconnected";
  // interaction?: GeometryInteractionEmit;
}
interface GeometryEventLifecycleUpdate {
  type: "lifecycle";
  lifecycle: "update";
  // interaction?: GeometryInteractionEmit;
  style: WidthHeight;
}
