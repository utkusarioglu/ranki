import type { WidthHeight } from "../../geometry-style.types.mjs";
import type {
  GeometryInteraction,
  GeometryInteractionState,
} from "../sets/children/registry/children-registry.types.mjs";

export type EmitType = "interaction" | "lifecycle";

export type GeometryEvent = GeometryEventInteraction | GeometryEventLifecycle;

export interface GeometryEventInteraction {
  interaction: GeometryInteractionEmit;
  type: "interaction";
}

export type GeometryEventLifecycle =
  | GeometryEventLifecycleConnected
  | GeometryEventLifecycleDisconnected
  | GeometryEventLifecycleLeave
  | GeometryEventLifecycleUpdate;

export interface GeometryEventTypes {
  hover: boolean;
}

export type GeometryInteractionEmit =
  `${keyof GeometryInteraction}-${GeometryInteractionState}`;

interface GeometryEventLifecycleConnected {
  lifecycle: "connected";
  type: "lifecycle";
  // interaction?: GeometryInteractionEmit;
}

interface GeometryEventLifecycleDisconnected {
  lifecycle: "disconnected";
  type: "lifecycle";
  // interaction?: GeometryInteractionEmit;
}

interface GeometryEventLifecycleLeave {
  lifecycle: "leave";
  type: "lifecycle";
  // interaction?: GeometryInteractionEmit;
}
interface GeometryEventLifecycleUpdate {
  lifecycle: "update";
  // interaction?: GeometryInteractionEmit;
  style: WidthHeight;
  type: "lifecycle";
}
