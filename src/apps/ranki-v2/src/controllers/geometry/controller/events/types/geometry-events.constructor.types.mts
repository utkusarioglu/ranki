import type { LitElement } from "lit";

import type { ACTION_TIME_SEPARATOR } from "../geometry-events.constants.mjs";
import type { LocalAction } from "./geometry-events.types.mjs";

export type ActionTimes = "end" | "start";

export type GeometryEventCb<Instance> = (
  s: Instance,
  event: GeometryEventName,
) => void;

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
