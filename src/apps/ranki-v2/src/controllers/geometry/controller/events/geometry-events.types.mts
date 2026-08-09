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

export type R2CNewChildSizeEvent = R2CNewChildMode | R2CNewChildSizeEventIntent;

export type R2CNewChildSizeEventIntent =
  | R2CNewChildLeave
  | R2CNewChildSizeConnected
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeUpdate;

interface R2CNewChildLeave {
  type: "intent";
  intent: "leave";
  mode?: EmitModes;
}

interface R2CNewChildMode {
  type: "mode";
  mode: EmitModes;
}

interface R2CNewChildSizeConnected {
  type: "intent";
  intent: "connected";
  mode?: EmitModes;
}

interface R2CNewChildSizeDisconnected {
  type: "intent";
  intent: "disconnected";
  mode?: EmitModes;
}
interface R2CNewChildSizeUpdate {
  type: "intent";
  intent: "update";
  mode?: EmitModes;
  style: WidthHeight;
}
