import type { LitElement } from "lit";

import type { LocalAction } from "./geometry-events.types.mjs";
import type { ACTION_TIME_SEPARATOR } from "../geometry-events.constants.mjs";

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

export type ActionTimes = "start" | "end";

export type GeometryEventName =
  `${LocalAction}${typeof ACTION_TIME_SEPARATOR}${ActionTimes}`;

export interface GeometryEventsConstructorParams<Instance extends LitElement> {
  events?: GeometryEventTypes;
  host: Instance;
  on?: GeometryEventCb<Instance>;
}

export interface GeometryEventTypes {
  hover: boolean;
}
