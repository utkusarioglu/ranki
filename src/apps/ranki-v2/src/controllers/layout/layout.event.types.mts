import type { LayoutSize } from "./layout.types.mts";

interface LayoutEventUpdate {
  intent: "update";
  sizing: LayoutSize;
}

interface LayoutEventEnter {
  intent: "enter";
}

interface LayoutEventLeave {
  intent: "leave";
}

interface LayoutEventConnect {
  intent: "connect";
}

interface LayoutEventDisconnect {
  intent: "disconnect";
}

export type LayoutEvent =
  | LayoutEventUpdate
  | LayoutEventEnter
  | LayoutEventLeave
  | LayoutEventConnect
  | LayoutEventDisconnect;

export type LayoutIntent = LayoutEvent["intent"];
// | R2CNewChildSizeDisconnected
// | R2CNewChildSizeConnected
// | R2CNewChildLeave
// | R2CNewChildMode;
