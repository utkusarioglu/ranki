import type { LitElement } from "lit";
import type { LocalAction } from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";

interface R2CNewChildLeave {
  intent: "leave";
}

interface R2CNewChildMode {
  intent: "mode";
  mode: EmitModes;
}

interface R2CNewChildSizeConnected {
  intent: "connected";
}

interface R2CNewChildSizeDisconnected {
  intent: "disconnected";
}

interface R2CNewChildSizeUpdate {
  intent: "update";
  style: WidthHeight;
}

export type R2CNewChildSizeEvent =
  | R2CNewChildSizeUpdate
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeConnected
  | R2CNewChildLeave
  | R2CNewChildMode;

export type EmitModes = "hover-start" | "hover-end";

export type GeometryEventName = `${LocalAction}-start` | `${LocalAction}-end`;

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

export interface GeometryEventTypes {
  hover: boolean;
}
export interface GeometryEventsConstructorParams<Instance extends LitElement> {
  host: Instance;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
}
