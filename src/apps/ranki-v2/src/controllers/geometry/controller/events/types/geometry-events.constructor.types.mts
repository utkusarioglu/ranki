import type { LitElement } from "lit";

import type { LocalAction } from "./geometry-events.types.mjs";

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
