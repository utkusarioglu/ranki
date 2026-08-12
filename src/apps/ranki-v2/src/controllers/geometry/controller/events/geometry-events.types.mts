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

/**
 * Value "enter" is used when an "update" is made on an object that doesn't yet exist.
 * !FIX "none" is now an escape hatch for situations where a child cannot be found but a placeholder is needed. I believe this is a conceptual flaw.
 */
export type EmitLifecycleInterpreted = "enter" | "none";

export type EmitLifecycle =
  | GeometryEventLifecycle["lifecycle"]
  | EmitLifecycleInterpreted;
// | "enter"
// | "interaction"
// | "leave"
// | "none"
// | "update";

export type LocalAction = EmitLifecycle | GeometryInteractionEmit;
