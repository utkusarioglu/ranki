import type { R2C } from "_components/r2c/r2c.mjs";
import type {
  GeometryEventCb,
  GeometryEventTypes,
} from "_controllers/geometry/controller/events/geometry-events.types.mjs";
import type { LitElement } from "lit";
import type { GeometryChildrenProps } from "../children/children.types.mjs";
import type { GeometryWatcherRecord } from "../watcher/watcher.types.mjs";

export interface GeometryControllerConstructorParams<
  Instance extends LitElement,
> {
  role: GeometryRole;
  events?: GeometryEventTypes;
  on?: GeometryEventCb<Instance>;
  watchers?: GeometryWatcherRecord<Instance>;
  children?: GeometryChildrenProps<Instance>;
}

export type GeometrySetSelectorCb<Instance extends LitElement> = (
  s: Instance,
) => R2C[];

export type GeometryRole = string & { type?: "GeometryRole" };
