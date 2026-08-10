import type { LitElement } from "lit";

import type { LocalAction } from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";

export type EmitType = "intent" | "mode";

export type EmitModes = "hover-end" | "hover-start" | "idle";

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

export type GeometryEventName = `${LocalAction}-end` | `${LocalAction}-start`;

export interface GeometryEventsConstructorParams<Instance extends LitElement> {
  events?: GeometryEventTypes;
  host: Instance;
  on?: GeometryEventCb<Instance>;
}

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
