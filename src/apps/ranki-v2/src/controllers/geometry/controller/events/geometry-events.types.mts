import type { LitElement } from "lit";

import type { LocalAction } from "../../geometry-intent.types.mjs";
import type { WidthHeight } from "../../geometry-style.types.mjs";

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

export type R2CNewChildSizeEvent =
  | R2CNewChildLeave
  | R2CNewChildMode
  | R2CNewChildSizeConnected
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeUpdate;

interface R2CNewChildLeave {
  intent: "leave";
  mode?: EmitModes;
}

interface R2CNewChildMode {
  intent: "mode";
  mode: EmitModes;
}

interface R2CNewChildSizeConnected {
  intent: "connected";
  mode?: EmitModes;
}

interface R2CNewChildSizeDisconnected {
  intent: "disconnected";
  mode?: EmitModes;
}
interface R2CNewChildSizeUpdate {
  intent: "update";
  mode?: EmitModes;
  style: WidthHeight;
}
