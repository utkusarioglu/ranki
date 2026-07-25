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
  rect: DOMRect;
}

export type R2CNewChildSizeEvent =
  | R2CNewChildSizeUpdate
  | R2CNewChildSizeDisconnected
  | R2CNewChildSizeConnected
  | R2CNewChildLeave
  | R2CNewChildMode;

export type EmitModes = "hover-start" | "hover-end";
